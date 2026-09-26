import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendBrevoTransactional } from '@/lib/brevo';

export const dynamic = 'force-dynamic';

const MONEY_MAX = 1_000_000;
const PCT_MAX = 100;

/** Accept finite numbers only; clamp to [min, max]. Non-numbers → null. */
function sanitizeNumber(value: unknown, min: number, max: number): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return Math.min(max, Math.max(min, value));
}

async function sendBrevoEmail(submitterEmail: string, type: 'instructor' | 'student') {
  const apiKey = process.env.BREVO_API_KEY;
  const templateId = parseInt(
    (type === 'instructor'
      ? process.env.BREVO_INSTRUCTOR_TEMPLATE_ID
      : process.env.BREVO_STUDENT_TEMPLATE_ID) ?? '0',
    10
  );

  if (!apiKey || !templateId) {
    console.error(`Brevo config missing for ${type}: API key or template ID not set`);
    return;
  }

  const now = new Date();
  const submittedAt = now.toLocaleString('en-US', {
    timeZone: 'America/Vancouver',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }) + ' PST';

  const role = type === 'instructor' ? 'Independent Instructor' : 'Student';

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: [{ email: 'yogi@promoga.com' }],
        replyTo: { email: submitterEmail },
        templateId,
        params: {
          email: submitterEmail,
          role,
          submitted_at: submittedAt,
        },
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Brevo API error (${type}):`, res.status, errorBody);
    } else {
      console.log(`Brevo ${type} waitlist email sent for:`, submitterEmail);
    }
  } catch (err) {
    console.error(`Failed to send Brevo ${type} email:`, err);
  }
}

/**
 * Send CASL-compliant student confirmation email via Brevo.
 */
async function sendStudentConfirmationEmail(email: string, consentTimestamp: Date) {
  const appUrl = process.env.NEXTAUTH_URL ?? 'https://promoga.com';

  const consentTime = consentTimestamp.toLocaleString('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  }) + ' ET';

  const unsubscribeUrl = `${appUrl}/api/waitlist/unsubscribe?email=${encodeURIComponent(email)}`;

  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <div style="background: linear-gradient(135deg, #0A7E8C 0%, #0d9aa8 100%); padding: 32px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">You're on the Student List! 🎉</h1>
      </div>
      <div style="background: #ffffff; padding: 28px 24px; border: 1px solid #e5e5e5; border-top: none;">
        <p style="font-size: 16px; line-height: 1.6;">Thanks for signing up! We'll notify you when Promoga launches in Toronto so you can discover independent classes near you.</p>
        <p style="font-size: 14px; line-height: 1.6; color: #555;">No action is needed on your part — we'll send you one email when we're live.</p>
      </div>
      <div style="background: #f9f9f9; padding: 20px 24px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px; font-size: 12px; color: #888; line-height: 1.6;">
        <p style="margin: 0 0 8px;"><strong>Promoga Technologies Inc.</strong></p>
        <p style="margin: 0 0 4px;">1771 Robson Street-1463<br>Vancouver, BC V6G 1C9</p>
        <p style="margin: 0 0 12px;">Contact: <a href="mailto:yogi@promoga.com" style="color: #0A7E8C;">yogi@promoga.com</a></p>
        <p style="margin: 0;">You agreed to receive a launch notification from Promoga on ${consentTime}. You can <a href="${unsubscribeUrl}" style="color: #0A7E8C;">unsubscribe at any time</a>. Your request will be honored within 10 business days per CASL.</p>
      </div>
    </div>
  `;

  await sendBrevoTransactional({
    to: [{ email }],
    subject: 'You\'re on the Promoga Student List! 🎉',
    htmlContent: htmlBody,
    context: 'student confirmation',
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, name, type, interest, source, monthlySpend, annualSpend, aggregatorCommissionPct, estimatedSavings, monthlyBookingRevenue, calculatorMode, selectedTools } = data ?? {};

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Capture IP for CASL consent
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') ?? 'unknown';

    // Check if email already exists
    const existingSignup = await prisma.waitlistSignup.findUnique({
      where: { email },
    });

    if (existingSignup) {
      // If they started but never confirmed (pending_consent), let them continue
      if (existingSignup.status === 'pending_consent') {
        return NextResponse.json({
          success: true,
          message: 'Continuing your signup!',
          id: existingSignup.id,
          position: await prisma.waitlistSignup.count(),
          resuming: true,
        });
      }
      return NextResponse.json(
        { success: false, message: 'duplicate', duplicate: true },
        { status: 409 }
      );
    }

    const isStudent = type === 'student';
    const now = new Date();

    // Student signup: single-step, immediately confirmed with CASL consent.
    // Instructor signup: pending_consent until Screen 2 completion.
    const signup = await prisma.waitlistSignup.create({
      data: {
        email,
        name: name ?? null,
        type: type ?? null,
        interest: interest ?? null,
        status: isStudent ? 'confirmed' : 'pending_consent',
        caslConsent: isStudent ? true : false,
        caslConsentTimestamp: isStudent ? now : null,
        caslConsentIp: isStudent ? ip : null,
        formVersion: isStudent ? 'student-notify-v1' : null,
        source: source ?? null,
        monthlySpend: sanitizeNumber(monthlySpend, 0, MONEY_MAX),
        annualSpend: sanitizeNumber(annualSpend, 0, MONEY_MAX),
        aggregatorCommissionPct: sanitizeNumber(aggregatorCommissionPct, 0, PCT_MAX),
        estimatedSavings: sanitizeNumber(estimatedSavings, 0, MONEY_MAX),
        monthlyBookingRevenue: sanitizeNumber(monthlyBookingRevenue, 0, MONEY_MAX),
        calculatorMode: typeof calculatorMode === 'string' ? calculatorMode : null,
        selectedTools: Array.isArray(selectedTools) ? selectedTools.join(',') : (typeof selectedTools === 'string' ? selectedTools : null),
      },
    });

    // Send student confirmation email with CASL-compliant footer
    if (isStudent) {
      sendStudentConfirmationEmail(email, now).catch((err) =>
        console.error('Student confirmation email background error:', err)
      );
      // Also notify admin via Brevo
      sendBrevoEmail(email, 'student').catch((err) =>
        console.error('Brevo email background error:', err)
      );
    }

    // Get count for position
    const count = await prisma.waitlistSignup.count();

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the waitlist!',
      position: count,
      id: signup.id,
    });
  } catch (error) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const totalCount = await prisma.waitlistSignup.count();
    // Live founding application count — only fully confirmed applications.
    // pending_consent (Step 1 email-only) rows are excluded from the public count.
    const foundingCount = await prisma.waitlistSignup.count({
      where: { type: 'instructor', status: 'confirmed' },
    });
    const threshold = parseInt(process.env.COUNTER_REVEAL_THRESHOLD ?? '25', 10);
    return NextResponse.json({
      success: true,
      count: totalCount,
      foundingCount,
      showCounter: foundingCount >= threshold,
    });
  } catch (error) {
    console.error('Get waitlist count error:', error);
    return NextResponse.json(
      { success: false, count: 0, foundingCount: 0, showCounter: false },
      { status: 500 }
    );
  }
}