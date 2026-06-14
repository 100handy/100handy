// Shared outreach email sender + follow-up sequence helpers.
// Used by send-outreach-message (initial sends) and outreach-follow-up-cron (auto follow-ups).

import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

export const SENDER_SIGNATURE = "100Handy — connecting trusted local professionals with nearby customers.";
export const OPT_OUT_LINE =
  "If you'd prefer not to receive opportunities from 100Handy, just reply STOP and we won't contact you again.";

// Automatic follow-up sequence: initial send schedules step 1 (+3d); each sent step
// schedules the next until FOLLOW_UP_MAX_STEPS. Conservative + B2B-only by design.
export const FIRST_FOLLOW_UP_DAYS = 3;
export const FOLLOW_UP_MAX_STEPS = 2;

export function isValidEmail(email: string | null | undefined): email is string {
  return Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Days until the next auto follow-up after sending `step`, or null when the sequence is done. */
export function nextFollowUpDueDays(step: number): number | null {
  if (step >= FOLLOW_UP_MAX_STEPS) return null;
  return 7; // step 1 (sent) -> step 2 due in 7 days
}

/** Short, low-pressure follow-up copy for a given step. */
export function buildFollowUpText(businessName: string | null, step: number): string {
  const name = businessName || "there";
  if (step >= FOLLOW_UP_MAX_STEPS) {
    return `Hi ${name}, circling back one last time — if extra local work through 100Handy would be useful, just reply and I'll share how it works. No problem if it's not for you.`;
  }
  return `Hi ${name}, following up on my note about local work opportunities with 100Handy. If you're interested, reply and I'll send over the details.`;
}

export type OutreachEmail = { to: string; subject: string; bodyText: string };

/** Sends a single outreach email via SMTP, appending the 100Handy signature + opt-out line. */
export async function sendOutreachEmail({ to, subject, bodyText }: OutreachEmail): Promise<void> {
  const host = Deno.env.get("SMTP_HOST");
  const port = Number(Deno.env.get("SMTP_PORT") ?? "465");
  const smtpUser = Deno.env.get("SMTP_USER");
  const smtpPass = Deno.env.get("SMTP_PASSWORD");
  if (!host || !smtpUser || !smtpPass) {
    throw new Error("SMTP is not configured");
  }

  const text = `${bodyText}\n\n—\n${SENDER_SIGNATURE}\n${OPT_OUT_LINE}`;
  const html = `<div style="font-family:sans-serif;font-size:14px;line-height:1.5;color:#0f172a">
<p>${escapeHtml(bodyText).replace(/\n/g, "<br/>")}</p>
<hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0"/>
<p style="color:#64748b;font-size:12px">${escapeHtml(SENDER_SIGNATURE)}<br/>${escapeHtml(OPT_OUT_LINE)}</p>
</div>`;

  const client = new SMTPClient({
    connection: { hostname: host, port, tls: port === 465, auth: { username: smtpUser, password: smtpPass } },
  });
  try {
    await client.send({ from: `100 Handy <${smtpUser}>`, to, subject, content: text, html });
  } finally {
    await client.close();
  }
}
