import { sendResendEmail } from "./email";

// Verizon email-to-SMS gateway for the business's own dispatch number. Carrier
// SMS gateways typically drop/ignore the subject and render the plain-text
// body only, so keep it short (~140 chars) and send text, not HTML.
const DISPATCH_SMS_EMAIL = "6202823847@vtext.com";

export function sendLeadSms(
  apiKey: string,
  lead: { name: string; phone: string; message: string }
) {
  const snippet = lead.message.length > 60 ? `${lead.message.slice(0, 60)}…` : lead.message;
  const text = `New PWS lead: ${lead.name} ${lead.phone} - ${snippet}`.slice(0, 140);
  return sendResendEmail(apiKey, {
    to: DISPATCH_SMS_EMAIL,
    subject: "",
    text,
  });
}
