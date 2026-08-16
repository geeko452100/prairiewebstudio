const FROM = "Prairie Web Studio <leads@prairiewebstudio.com>";

export async function sendResendEmail(
  apiKey: string,
  {
    to,
    subject,
    text,
  }: {
    to: string;
    subject: string;
    text: string;
  }
): Promise<{ error: string | null }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, text }),
  });
  if (!res.ok) {
    return { error: await res.text() };
  }
  return { error: null };
}

export function sendLeadEmail(
  apiKey: string,
  to: string,
  lead: { name: string; business: string; phone: string; message: string }
) {
  return sendResendEmail(apiKey, {
    to,
    subject: `New contact form lead: ${lead.name}`,
    text: [
      `Name: ${lead.name}`,
      `Business: ${lead.business}`,
      `Phone: ${lead.phone}`,
      "",
      lead.message,
    ].join("\n"),
  });
}
