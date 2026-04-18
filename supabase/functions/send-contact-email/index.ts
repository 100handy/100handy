import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface ContactPayload {
  about: string;
  email: string;
  subject: string;
  description: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as Partial<ContactPayload>;
    const about = (payload.about ?? "").trim();
    const email = (payload.email ?? "").trim();
    const subject = (payload.subject ?? "").trim();
    const description = (payload.description ?? "").trim();

    if (!email || !subject || !description) {
      return new Response(
        JSON.stringify({ error: "email, subject, and description are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (description.length > 5000 || subject.length > 200) {
      return new Response(
        JSON.stringify({ error: "Subject or description too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const host = Deno.env.get("SMTP_HOST");
    const port = Number(Deno.env.get("SMTP_PORT") ?? "465");
    const user = Deno.env.get("SMTP_USER");
    const pass = Deno.env.get("SMTP_PASSWORD");
    const supportInbox = Deno.env.get("SUPPORT_INBOX") ?? "help@100handy.com";

    if (!host || !user || !pass) {
      return new Response(
        JSON.stringify({ error: "SMTP not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const client = new SMTPClient({
      connection: {
        hostname: host,
        port,
        tls: port === 465,
        auth: { username: user, password: pass },
      },
    });

    const safeAbout = about ? escapeHtml(about) : "—";
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeDescription = escapeHtml(description).replace(/\n/g, "<br />");

    try {
      await client.send({
        from: `100 Handy Contact <${user}>`,
        to: supportInbox,
        replyTo: email,
        subject: `[Contact] ${subject}`,
        content: `New contact form submission\n\nAbout: ${about || "—"}\nFrom: ${email}\nSubject: ${subject}\n\n${description}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #222;">
            <h2 style="margin:0 0 16px;">New contact form submission</h2>
            <p style="margin:4px 0;"><strong>About:</strong> ${safeAbout}</p>
            <p style="margin:4px 0;"><strong>From:</strong> ${safeEmail}</p>
            <p style="margin:4px 0;"><strong>Subject:</strong> ${safeSubject}</p>
            <hr style="border:none; border-top:1px solid #eee; margin:16px 0;" />
            <div style="white-space: pre-wrap; line-height: 1.5;">${safeDescription}</div>
          </div>
        `,
      });
    } finally {
      await client.close();
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("send-contact-email error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
