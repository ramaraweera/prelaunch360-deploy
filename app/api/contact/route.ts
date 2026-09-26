import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, message } = data ?? {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Save to database
    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        message,
      },
    });

    // Send notification email
    try {
      const safeName = escapeHtml(String(name));
      const safeEmail = escapeHtml(String(email));
      // Escape first, then preserve newlines as <br> so tags cannot inject.
      const safeMessage = escapeHtml(String(message)).replace(/\n/g, '<br>');

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0A7E8C; border-bottom: 2px solid #F27059; padding-bottom: 10px;">
            New Contact Form Submission - Promoga Studio 360
          </h2>
          <div style="background: #FAF5F0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${safeName}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #0A7E8C;">${safeEmail}</a></p>
            <p style="margin: 10px 0;"><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #0A7E8C;">
              ${safeMessage}
            </div>
          </div>
          <p style="color: #666; font-size: 12px;">
            Submitted from Promoga Studio 360 Pre-Launch Website
          </p>
        </div>
      `;

      const appUrl = process.env.NEXTAUTH_URL ?? 'https://promoga.com';
      let appHostname = 'promoga.com';
      try {
        appHostname = new URL(appUrl).hostname;
      } catch {
        // Use default
      }

      await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_CONTACT_FORM_SUBMISSION,
          subject: `New Contact Form Submission from ${String(name).replace(/[\r\n]/g, ' ').slice(0, 200)}`,
          body: htmlBody,
          is_html: true,
          recipient_email: 'yogi@promoga.com',
          sender_email: `noreply@${appHostname}`,
          sender_alias: 'Promoga Studio 360',
        }),
      });
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}