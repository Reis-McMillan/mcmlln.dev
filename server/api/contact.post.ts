import { Resend } from "resend";

interface ContactBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  company?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LEN = 10000;

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactBody>(event);

  if (body.company && body.company.trim()) {
    return { ok: true };
  }

  const name = body.name?.trim() ?? "";
  const emailAddr = body.email?.trim() ?? "";
  const subject = body.subject?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !emailAddr || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }
  if (!EMAIL_RE.test(emailAddr)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid email" });
  }
  if (message.length > MAX_MESSAGE_LEN) {
    throw createError({ statusCode: 400, statusMessage: "Message too long" });
  }

  const { resendApiKey, contactToEmail, contactFromEmail } =
    useRuntimeConfig(event);
  if (!resendApiKey || !contactToEmail || !contactFromEmail) {
    throw createError({
      statusCode: 500,
      statusMessage: "Email service not configured",
    });
  }

  const resend = new Resend(resendApiKey);
  const { error } = await resend.emails.send({
    from: contactFromEmail,
    to: contactToEmail,
    replyTo: emailAddr,
    subject: `[mcmlln.dev] ${subject || "Contact form message"} — ${name}`,
    text: `From: ${name} <${emailAddr}>\n\n${message}`,
  });

  if (error) {
    throw createError({ statusCode: 502, statusMessage: "Failed to send" });
  }
  return { ok: true };
});
