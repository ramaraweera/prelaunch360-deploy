/**
 * PostHog reverse-proxy catch-all route.
 *
 * Proxies all requests from promoga.com/relay/* to PostHog's servers so that
 * event capture, feature-flag evaluation, session recording assets, and the
 * SDK script itself appear as first-party traffic.
 *
 * Using "/relay" instead of "/ph" avoids Chrome Enhanced Tracking Protection
 * which blocks known tracker path patterns like /e/, /capture/, /recorder/
 * even on first-party domains.
 *
 * Routing logic (mirrors the PostHog Next.js rewrite docs):
 *   /relay/static/*  → us-assets.i.posthog.com/static/*   (SDK + recorder JS)
 *   /relay/array/*   → us-assets.i.posthog.com/array/*     (remote config)
 *   /relay/*         → us.i.posthog.com/*                  (events, flags, decide)
 *
 * See: https://posthog.com/docs/advanced/proxy/nextjs
 */

import { NextRequest } from 'next/server';

// Prevent Next.js from issuing 308 redirects for trailing-slash variants
// of the catch-all path (PostHog SDK posts to /relay/e/ with a trailing slash).
export const dynamicParams = true;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const POSTHOG_API = 'https://us.i.posthog.com';
const POSTHOG_ASSETS = 'https://us-assets.i.posthog.com';

// Headers that must not be forwarded to the upstream.
const STRIP_REQUEST_HEADERS = new Set([
  'host',
  'connection',
  'transfer-encoding',
  'cookie',
  'cookie2',
  'authorization',
]);

// Headers that must not be forwarded back to the client.
const STRIP_RESPONSE_HEADERS = new Set([
  'transfer-encoding',
  'connection',
  'content-encoding', // let Next.js handle its own compression
]);

function buildUpstreamUrl(subpath: string, search: string): string {
  // Static SDK assets (array.js, recorder.js, etc.)
  if (subpath.startsWith('/static/') || subpath.startsWith('/array/')) {
    return `${POSTHOG_ASSETS}${subpath}${search}`;
  }
  // Everything else (event capture, decide, flags, session recordings)
  return `${POSTHOG_API}${subpath}${search}`;
}

async function proxyRequest(req: NextRequest, params: { path: string[] }) {
  // Filter out empty path segments (from trailing slashes like /relay/e/)
  // so we don't hit Next.js's automatic 308 canonicalization redirect.
  const cleanPath = params.path.filter((seg) => seg.length > 0);
  const subpath = '/' + cleanPath.join('/');
  const search = req.nextUrl.search || '';
  const upstream = buildUpstreamUrl(subpath, search);

  // Build forwarded headers, stripping hop-by-hop ones.
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    if (!STRIP_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers[key] = value;
    }
  });
  // Set the correct Host header for the upstream.
  const url = new URL(upstream);
  headers['host'] = url.host;

  // Forward the request body for POST/PATCH/PUT.
  let body: ArrayBuffer | null = null;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      body = await req.arrayBuffer();
    } catch {
      // No body — that's fine for some endpoints.
    }
  }

  try {
    const upstreamRes = await fetch(upstream, {
      method: req.method,
      headers,
      body,
      // @ts-expect-error — Next.js fetch supports duplex for streaming bodies.
      duplex: body ? 'half' : undefined,
    });

    // Build response headers, stripping ones Next.js manages.
    const resHeaders = new Headers();
    upstreamRes.headers.forEach((value, key) => {
      if (!STRIP_RESPONSE_HEADERS.has(key.toLowerCase())) {
        resHeaders.set(key, value);
      }
    });

    // Allow the browser to read the response (CORS for same-origin is fine,
    // but PostHog's recording sometimes does cross-origin fetches).
    if (!resHeaders.has('access-control-allow-origin')) {
      resHeaders.set('access-control-allow-origin', '*');
    }

    const responseBody = await upstreamRes.arrayBuffer();
    return new Response(responseBody, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: resHeaders,
    });
  } catch (err) {
    console.error('[PostHog Proxy] Upstream request failed:', upstream, err);
    return new Response('Bad Gateway', { status: 502 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(req, params);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(req, params);
}

export async function OPTIONS(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // Handle CORS preflight for recording uploads.
  const resHeaders = new Headers();
  resHeaders.set('access-control-allow-origin', '*');
  resHeaders.set('access-control-allow-methods', 'GET, POST, OPTIONS');
  resHeaders.set('access-control-allow-headers', 'Content-Type, Authorization');
  resHeaders.set('access-control-max-age', '86400');
  return new Response(null, { status: 204, headers: resHeaders });
}