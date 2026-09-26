import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Unsubscribe endpoint for CASL compliance.
 *
 * GET  /api/waitlist/unsubscribe?email=...  — shows a confirmation page
 * POST /api/waitlist/unsubscribe             — processes the unsubscription
 *
 * CASL rules:
 *  - Must be honored within 10 business days (we do it instantly).
 *  - Do NOT delete the record — flag as unsubscribed only.
 *  - Retain CASL consent records for a minimum of 3 years.
 *  - Immediately stop all CEMs to this address.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(value: string): boolean {
  // Practical format check — blocks HTML/script payloads while accepting normal emails.
  return /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(value) && value.length <= 254;
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email') ?? '';
  if (!email) {
    return new Response('Missing email parameter.', { status: 400 });
  }
  if (!isValidEmail(email)) {
    return new Response('Invalid email parameter.', { status: 400 });
  }

  const appUrl = process.env.NEXTAUTH_URL ?? 'https://promoga.com';
  const safeEmail = escapeHtml(email);

  // Simple confirmation page
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Unsubscribe — Promoga</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f9fafb; color: #1a1a1a; }
        .card { max-width: 440px; background: white; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); padding: 40px 32px; text-align: center; }
        h1 { font-size: 22px; margin: 0 0 12px; }
        p { font-size: 15px; color: #555; line-height: 1.6; }
        form { margin-top: 24px; }
        button { background: #0A7E8C; color: white; border: none; padding: 12px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; }
        button:hover { background: #087a87; }
        .email { font-weight: 600; color: #0A7E8C; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Unsubscribe from Promoga</h1>
        <p>Are you sure you want to unsubscribe <span class="email">${safeEmail}</span> from Promoga updates?</p>
        <form method="POST" action="${appUrl}/api/waitlist/unsubscribe">
          <input type="hidden" name="email" value="${safeEmail}" />
          <button type="submit">Yes, Unsubscribe Me</button>
        </form>
        <p style="margin-top: 20px; font-size: 13px; color: #999;">You’ll stop receiving all commercial messages from Promoga. This is processed immediately.</p>
      </div>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export async function POST(request: NextRequest) {
  try {
    let email = '';

    // Support both JSON and form-encoded bodies
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      email = body?.email ?? '';
    } else {
      const formData = await request.formData();
      email = (formData.get('email') as string) ?? '';
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required.' },
        { status: 400 }
      );
    }

    const existing = await prisma.waitlistSignup.findUnique({ where: { email } });
    if (!existing) {
      // Don't reveal whether the email exists
      return redirectToConfirmation();
    }

    // CASL: Flag as unsubscribed, do NOT delete. Retain for 3+ years.
    await prisma.waitlistSignup.update({
      where: { email },
      data: {
        unsubscribed: true,
        unsubscribedAt: new Date(),
      },
    });

    return redirectToConfirmation();
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}

function redirectToConfirmation() {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Unsubscribed — Promoga</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f9fafb; color: #1a1a1a; }
        .card { max-width: 440px; background: white; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); padding: 40px 32px; text-align: center; }
        h1 { font-size: 22px; margin: 0 0 12px; color: #0A7E8C; }
        p { font-size: 15px; color: #555; line-height: 1.6; }
        a { color: #0A7E8C; text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>You’ve been unsubscribed</h1>
        <p>You won’t receive any more commercial emails from Promoga. This change takes effect immediately.</p>
        <p style="margin-top: 20px;"><a href="https://promoga.com">Return to promoga.com</a></p>
      </div>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}