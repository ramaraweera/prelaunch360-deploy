import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Configurable ceiling for total CYA founding accounts (separate from public 50)
const CYA_MAX_REDEMPTIONS = parseInt(process.env.CYA_MAX_REDEMPTIONS ?? '100', 10);

class RedeemValidationError extends Error {
  status: number;
  body: Record<string, unknown>;

  constructor(status: number, body: Record<string, unknown>) {
    super(typeof body.message === 'string' ? body.message : 'Validation failed');
    this.status = status;
    this.body = body;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, code, studioName } = body ?? {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name is required.' },
        { status: 400 }
      );
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { success: false, message: 'Email is required.' },
        { status: 400 }
      );
    }
    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json(
        { success: false, message: 'Access code is required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim().toUpperCase();

    // Check if email already redeemed (fast path)
    const existingRedemption = await prisma.cyaRedemption.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingRedemption) {
      return NextResponse.json({
        success: false,
        duplicate: true,
        message: 'You\'ve already claimed your founding spot — no need to redeem twice. We\'ll be in touch.',
      }, { status: 409 });
    }

    // Check total CYA redemptions ceiling (fast path)
    const totalRedemptions = await prisma.cyaRedemption.count();
    if (totalRedemptions >= CYA_MAX_REDEMPTIONS) {
      return NextResponse.json({
        success: false,
        closed: true,
        message: 'All CYA founding spots have been claimed. You can still apply for a founding spot on our main page.',
      }, { status: 410 });
    }

    // Validate access code (fast path)
    const accessCode = await prisma.cyaAccessCode.findUnique({
      where: { code: normalizedCode },
    });

    if (!accessCode || !accessCode.active) {
      return NextResponse.json({
        success: false,
        invalid: true,
        message: 'That code isn\'t valid or has expired.',
      }, { status: 400 });
    }

    // Check expiry
    if (accessCode.expiresAt && new Date() > accessCode.expiresAt) {
      return NextResponse.json({
        success: false,
        invalid: true,
        message: 'That code isn\'t valid or has expired.',
      }, { status: 400 });
    }

    // Check usage limit
    if (accessCode.usedCount >= accessCode.maxUses) {
      return NextResponse.json({
        success: false,
        invalid: true,
        message: 'That code has already been used.',
      }, { status: 400 });
    }

    // Capture IP for CASL audit
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
    const consentTimestamp = new Date();

    // Create redemption and increment code usage in a transaction.
    // Re-check caps inside the transaction to prevent concurrent over-redemption.
    const redemption = await prisma.$transaction(async (tx) => {
      const lockedTotal = await tx.cyaRedemption.count();
      if (lockedTotal >= CYA_MAX_REDEMPTIONS) {
        throw new RedeemValidationError(410, {
          success: false,
          closed: true,
          message: 'All CYA founding spots have been claimed. You can still apply for a founding spot on our main page.',
        });
      }

      const lockedCode = await tx.cyaAccessCode.findUnique({
        where: { id: accessCode.id },
      });

      if (!lockedCode || !lockedCode.active) {
        throw new RedeemValidationError(400, {
          success: false,
          invalid: true,
          message: 'That code isn\'t valid or has expired.',
        });
      }

      if (lockedCode.expiresAt && new Date() > lockedCode.expiresAt) {
        throw new RedeemValidationError(400, {
          success: false,
          invalid: true,
          message: 'That code isn\'t valid or has expired.',
        });
      }

      if (lockedCode.usedCount >= lockedCode.maxUses) {
        throw new RedeemValidationError(400, {
          success: false,
          invalid: true,
          message: 'That code has already been used.',
        });
      }

      const r = await tx.cyaRedemption.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          studioName: studioName?.trim() || null,
          codeId: lockedCode.id,
          caslConsent: true,
          caslConsentTimestamp: consentTimestamp,
          caslConsentIp: clientIp,
        },
      });

      // Conditional increment — only succeeds if still under maxUses
      const updated = await tx.cyaAccessCode.updateMany({
        where: {
          id: lockedCode.id,
          usedCount: { lt: lockedCode.maxUses },
        },
        data: { usedCount: { increment: 1 } },
      });

      if (updated.count === 0) {
        throw new RedeemValidationError(400, {
          success: false,
          invalid: true,
          message: 'That code has already been used.',
        });
      }

      return r;
    });

    return NextResponse.json({
      success: true,
      message: 'Your founding spot is confirmed — welcome, Canadian Yoga Alliance member.',
      id: redemption.id,
    });
  } catch (error) {
    if (error instanceof RedeemValidationError) {
      return NextResponse.json(error.body, { status: error.status });
    }
    // Unique email constraint — concurrent duplicate redeem
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json({
        success: false,
        duplicate: true,
        message: 'You\'ve already claimed your founding spot — no need to redeem twice. We\'ll be in touch.',
      }, { status: 409 });
    }
    console.error('CYA redemption error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}