/**
 * Legacy PostHog proxy at /ph/*
 *
 * Kept for backward compatibility — the primary proxy is now at /relay/*.
 * Both paths forward to the same PostHog upstream. This ensures any cached
 * SDK bundles, in-flight requests, or browser sessions still using /ph
 * continue to work without interruption.
 *
 * This file can be removed once enough time has passed that no clients
 * reference /ph anymore (e.g., after a few weeks).
 */

export { GET, POST, OPTIONS } from '@/app/relay/[...path]/route';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
