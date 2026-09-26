import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendBrevoTransactional } from '@/lib/brevo';

export const dynamic = 'force-dynamic';

const VALID_ROLES = ['solo_instructor', 'small_studio', 'larger_studio'];
const FORM_VERSION = 'waitlist-v1';

/**
 * Send CASL-compliant confirmation email via Brevo.
 */
async function sendConfirmationEmail(signup: {
  email: string;
  instagramHandle: string | null;
  city: string | null;
  role: string | null;
  caslConsentTimestamp: Date | null;
}) {
  const appUrl = process.env.NEXTAUTH_URL ?? 'https://promoga.com';

  const consentTime = signup.caslConsentTimestamp
    ? new Date(signup.caslConsentTimestamp).toLocaleString('en-CA', {
        timeZone: 'America/Toronto',
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      }) + ' ET'
    : 'N/A';

  const roleLabels: Record<string, string> = {
    solo_instructor: 'Solo Instructor',
    small_studio: 'Small Studio (1–3 instructors)',
    larger_studio: 'Larger Studio (4+ instructors)',
  };

  const unsubscribeUrl = `${appUrl}/api/waitlist/unsubscribe?email=${encodeURIComponent(signup.email)}`;

  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <div style="background: linear-gradient(135deg, #0A7E8C 0%, #0d9aa8 100%); padding: 32px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Your application is in 🎉</h1>
      </div>
      <div style="background: #ffffff; padding: 28px 24px; border: 1px solid #e5e5e5; border-top: none;">
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>You're on the waitlist for Promoga's Founding Instructor program.</strong></p>
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px; color: #444;">Thanks for applying! We're hand-selecting <strong>50 founding instructors</strong> for our Toronto launch, and a real person from our team will personally review your studio profile.</p>
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 8px; color: #444;">Here's a summary of what you submitted:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 12px 0 24px;">
          <tr><td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; color: #666; width: 40%;">Email</td><td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-weight: 600;">${signup.email}</td></tr>
          <tr><td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; color: #666;">Instagram</td><td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-weight: 600;">@${signup.instagramHandle || 'N/A'}</td></tr>
          <tr><td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; color: #666;">City</td><td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-weight: 600;">${signup.city || 'N/A'}</td></tr>
          <tr><td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; color: #666;">Role</td><td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-weight: 600;">${roleLabels[signup.role ?? ''] ?? signup.role ?? 'N/A'}</td></tr>
          <tr><td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; color: #666;">Submitted</td><td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-weight: 600;">${consentTime}</td></tr>
        </table>
        <h2 style="font-size: 17px; font-weight: 700; color: #0A7E8C; margin: 0 0 14px;">What happens next</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px;">
          <tr><td style="padding: 0 12px 16px 0; vertical-align: top; width: 28px; font-size: 16px; font-weight: 700; color: #0A7E8C;">1.</td><td style="padding: 0 0 16px; font-size: 14px; line-height: 1.6; color: #444;"><strong>We review your studio</strong> — Our team personally evaluates each application. No bots, no auto-approvals.</td></tr>
          <tr><td style="padding: 0 12px 16px 0; vertical-align: top; font-size: 16px; font-weight: 700; color: #0A7E8C;">2.</td><td style="padding: 0 0 16px; font-size: 14px; line-height: 1.6; color: #444;"><strong>You get a direct email</strong> — The moment a founding spot opens for you, we'll reach out with your personalized invitation link.</td></tr>
          <tr><td style="padding: 0 12px 0 0; vertical-align: top; font-size: 16px; font-weight: 700; color: #0A7E8C;">3.</td><td style="padding: 0; font-size: 14px; line-height: 1.6; color: #444;"><strong>Founding perks lock in</strong> — Once invited and confirmed, you'll receive <strong>1% commission, forever</strong> — a benefit exclusive to our 50 founding members.</td></tr>
        </table>
        <div style="background: #fef4f1; border-left: 4px solid #F27059; padding: 16px 18px; border-radius: 8px; margin: 0;">
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #444;">💡 <strong>Spots are limited.</strong> We're capping the founding cohort at 50 instructors for the Toronto launch, so keep an eye on your inbox.</p>
        </div>
      </div>
      <div style="background: #f9f9f9; padding: 20px 24px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px; font-size: 12px; color: #888; line-height: 1.6;">
        <p style="margin: 0 0 8px;"><strong>Promoga Technologies Inc.</strong></p>
        <p style="margin: 0 0 4px;">1771 Robson Street-1463<br>Vancouver, BC V6G 1C9</p>
        <p style="margin: 0 0 12px;">Contact: <a href="mailto:yogi@promoga.com" style="color: #0A7E8C;">yogi@promoga.com</a></p>
        <p style="margin: 0;">You agreed to receive updates from Promoga on ${consentTime}. You can <a href="${unsubscribeUrl}" style="color: #0A7E8C;">unsubscribe at any time</a>. Your request will be honored within 10 business days per CASL.</p>
      </div>
    </div>
  `;

  await sendBrevoTransactional({
    to: [{ email: signup.email }],
    subject: "Your application is in — here's what happens next",
    htmlContent: htmlBody,
    context: 'instructor confirmation',
  });
}

/**
 * Send admin notification email via Brevo when Screen 2 is completed.
 * Full HTML is defined here — no external template needed, so every field
 * shows up immediately.
 */
async function sendAdminNotificationEmail(signup: {
  email: string;
  instagramHandle: string | null;
  city: string | null;
  role: string | null;
  qualifiedAt: Date;
}) {
  const roleLabels: Record<string, string> = {
    solo_instructor: 'Independent Instructor',
    small_studio: 'Small Studio (1–3 instructors)',
    larger_studio: 'Larger Studio (4+ instructors)',
  };

  const submittedAt = signup.qualifiedAt.toLocaleString('en-US', {
    timeZone: 'America/Vancouver',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }) + ' PST';

  const roleDisplay = roleLabels[signup.role ?? ''] ?? signup.role ?? 'N/A';
  const igDisplay = signup.instagramHandle ? `@${signup.instagramHandle}` : 'N/A';
  const cityDisplay = signup.city || 'N/A';

  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <div style="background: linear-gradient(135deg, #0A7E8C 0%, #0d9aa8 100%); padding: 28px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">✅ New Qualified Signup — Studio 360 Waitlist</h1>
      </div>
      <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e5e5; border-top: none;">
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">Hello Promoga team,</p>
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px;">A new <strong>instructor or studio</strong> has completed the full 2-step signup and given CASL consent. Here are the details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
          <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 700; width: 40%; background: #f9f9f9;">Email</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${signup.email}" style="color: #0A7E8C;">${signup.email}</a></td></tr>
          <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 700; background: #f9f9f9;">Instagram</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">${igDisplay}</td></tr>
          <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 700; background: #f9f9f9;">City</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">${cityDisplay}</td></tr>
          <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 700; background: #f9f9f9;">Role</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">${roleDisplay}</td></tr>
          <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 700; background: #f9f9f9;">CASL Consent</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">✅ Yes</td></tr>
          <tr><td style="padding: 12px 16px; font-weight: 700; background: #f9f9f9;">Submitted at</td><td style="padding: 12px 16px;">${submittedAt}</td></tr>
        </table>
        <p style="font-size: 13px; color: #888; margin: 0;">This notification was sent automatically from the Studio 360 waitlist form.</p>
      </div>
    </div>
  `;

  await sendBrevoTransactional({
    to: [{ email: 'yogi@promoga.com' }],
    replyTo: { email: signup.email },
    subject: `✅ Qualified Signup: ${signup.email} — ${roleDisplay}`,
    htmlContent: htmlBody,
    context: 'qualified signup admin',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, instagramHandle, city, role } = body ?? {};

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Missing signup id.' },
        { status: 400 }
      );
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { success: false, message: 'Email is required.' },
        { status: 400 }
      );
    }
    if (!instagramHandle || typeof instagramHandle !== 'string' || !instagramHandle.trim()) {
      return NextResponse.json(
        { success: false, message: 'Instagram handle is required.' },
        { status: 400 }
      );
    }
    if (!city || typeof city !== 'string' || !city.trim()) {
      return NextResponse.json(
        { success: false, message: 'City is required.' },
        { status: 400 }
      );
    }
    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { success: false, message: 'A valid role is required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Normalize instagram handle — strip leading @, whitespace.
    const cleanHandle = instagramHandle.trim().replace(/^@+/, '');

    const existing = await prisma.waitlistSignup.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Signup not found.' },
        { status: 404 }
      );
    }

    // Ownership check — id alone is not enough to mutate another user's signup.
    if (existing.email.toLowerCase() !== normalizedEmail) {
      return NextResponse.json(
        { success: false, message: 'Unable to complete this signup.' },
        { status: 403 }
      );
    }

    // Idempotent: already finished Step 2 — do not overwrite or re-send emails.
    if (existing.status === 'confirmed') {
      return NextResponse.json({
        success: true,
        alreadyConfirmed: true,
        message: "You're already on the list.",
      });
    }

    if (existing.status !== 'pending_consent') {
      return NextResponse.json(
        { success: false, message: 'Unable to complete this signup.' },
        { status: 403 }
      );
    }

    // Capture client IP for CASL audit trail
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';

    const consentTimestamp = new Date();

    const updated = await prisma.waitlistSignup.update({
      where: { id },
      data: {
        instagramHandle: cleanHandle,
        city: city.trim(),
        role,
        qualifiedAt: consentTimestamp,
        status: 'confirmed',
        caslConsent: true,
        caslConsentTimestamp: consentTimestamp,
        caslConsentIp: clientIp,
        formVersion: FORM_VERSION,
      },
    });

    // Send CASL-compliant confirmation email to the user (fire-and-forget)
    sendConfirmationEmail({
      email: updated.email,
      instagramHandle: updated.instagramHandle,
      city: updated.city,
      role: updated.role,
      caslConsentTimestamp: consentTimestamp,
    }).catch((err) => console.error('Confirmation email background error:', err));

    // Send admin notification email with all Screen 2 data (fire-and-forget)
    sendAdminNotificationEmail({
      email: updated.email,
      instagramHandle: updated.instagramHandle,
      city: updated.city,
      role: updated.role,
      qualifiedAt: consentTimestamp,
    }).catch((err) => console.error('Admin notification email background error:', err));

    return NextResponse.json({
      success: true,
      message: "You're on the list! We'll be in touch before our Toronto launch.",
    });
  } catch (error) {
    console.error('Qualify signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}