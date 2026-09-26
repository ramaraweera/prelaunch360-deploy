/**
 * Shared helper for sending transactional emails via the Brevo (Sendinblue) API.
 *
 * Uses raw HTML content (htmlContent) so the existing rich, CASL-compliant
 * email templates defined in the API routes can be reused verbatim — only the
 * transport changes from the Abacus notification API to Brevo.
 */

interface BrevoRecipient {
  email: string;
  name?: string;
}

interface SendBrevoTransactionalParams {
  to: BrevoRecipient[];
  subject: string;
  htmlContent: string;
  /** Optional reply-to address (e.g. the submitter's email for admin alerts). */
  replyTo?: BrevoRecipient;
  /** Override the default sender name (defaults to BREVO_SENDER_NAME). */
  senderName?: string;
  /** Override the default sender email (defaults to BREVO_SENDER_EMAIL). */
  senderEmail?: string;
  /** Label used in log lines for easier debugging. */
  context?: string;
}

/**
 * Send a transactional email through Brevo using raw HTML content.
 * Returns true on success, false on any failure (never throws).
 */
export async function sendBrevoTransactional({
  to,
  subject,
  htmlContent,
  replyTo,
  senderName,
  senderEmail,
  context = 'email',
}: SendBrevoTransactionalParams): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = senderEmail ?? process.env.BREVO_SENDER_EMAIL ?? 'no-reply@promoga.com';
  const fromName = senderName ?? process.env.BREVO_SENDER_NAME ?? 'Promoga Studio 360';

  if (!apiKey) {
    console.error(`Brevo config missing for ${context}: BREVO_API_KEY not set`);
    return false;
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to,
        ...(replyTo ? { replyTo } : {}),
        subject,
        htmlContent,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Brevo API error (${context}):`, res.status, errorBody);
      return false;
    }

    console.log(`Brevo ${context} email sent to:`, to.map((r) => r.email).join(', '));
    return true;
  } catch (err) {
    console.error(`Failed to send Brevo ${context} email:`, err);
    return false;
  }
}
