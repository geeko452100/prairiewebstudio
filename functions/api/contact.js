/**
 * Direct contact-form handler for prairiewebstudio.com.
 *
 * Replaces the old relay to the shared prairie-dispatch-db worker
 * (functions/api/v1/dispatch.js, now removed) — that worker was built for
 * multi-tenant SMS dispatch and wasn't a good fit for a single site's
 * contact form. This calls Resend directly, the same pattern specterui.dev
 * already uses (specter-ui/nodejs-backend/src/routes/contact.ts).
 *
 * Required Pages secrets/vars (Settings → Environment variables):
 *   RESEND_API_KEY   secret — from resend.com/api-keys
 *   RESEND_FROM      var    — sender address on a domain verified with Resend
 *                             (e.g. contact@prairiewebstudio.com — the domain
 *                             must be verified in the Resend dashboard, or
 *                             sends will fail even with a valid API key)
 *   CONTACT_TO       var    — where the lead notification gets delivered
 *                             (your inbox, not the customer's)
 *
 * Sends two emails per submission: the lead notification to CONTACT_TO
 * (reply-able straight to the customer via reply_to), and a short
 * confirmation back to the customer's own address.
 */

const MAX_FIELD_LENGTH = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Malformed request body.' }, { status: 400 });
  }

  // Honeypot: real visitors never fill this in (it's visually hidden).
  if (typeof body._gotcha === 'string' && body._gotcha.trim() !== '') {
    return Response.json({ ok: true });
  }

  const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
  const business = typeof body.business === 'string' ? body.business.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const address = typeof body.address === 'string' ? body.address.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!customerName || !business || !email || !phone || !address || !message) {
    return Response.json(
      { error: 'Name, business name, email, phone, business location, and message are all required.' },
      { status: 400 }
    );
  }

  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "That email address doesn't look valid." }, { status: 400 });
  }

  for (const [field, value] of Object.entries({ customerName, business, email, phone, address, message })) {
    if (value.length > MAX_FIELD_LENGTH) {
      return Response.json({ error: `${field} is too long.` }, { status: 400 });
    }
  }

  const to = env.CONTACT_TO || 'ggriffith@prairiewebstudio.com';
  const leadText =
    `New contact form submission from prairiewebstudio.com\n\n` +
    `Name: ${customerName}\n` +
    `Business: ${business}\n` +
    `Email: ${email}\n` +
    `Phone: ${phone}\n` +
    `Location: ${address}\n\n` +
    `Message:\n${message}`;

  try {
    // Lead notification — goes to you, reply-able straight to the customer.
    const leadRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Prairie Web Studio contact form <${env.RESEND_FROM}>`,
        to: [to],
        reply_to: `${customerName} <${email}>`,
        subject: `New contact form message from ${customerName} (${business})`,
        text: leadText,
        html: `<p><strong>Name:</strong> ${escapeHtml(customerName)}</p><p><strong>Business:</strong> ${escapeHtml(business)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Phone:</strong> ${escapeHtml(phone)}</p><p><strong>Location:</strong> ${escapeHtml(address)}</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      }),
    });

    if (!leadRes.ok) {
      const data = await leadRes.json().catch(() => ({}));
      console.error('Resend API error (lead notification)', leadRes.status, data);
      return Response.json({ error: 'Failed to send message. Try again later.' }, { status: 502 });
    }
  } catch (err) {
    console.error('Resend request failed (lead notification)', err);
    return Response.json({ error: 'Failed to send message. Try again later.' }, { status: 502 });
  }

  // Confirmation to the customer — best-effort only. The lead notification
  // above already succeeded and is what actually gets you paid, so a hiccup
  // here shouldn't make the form look like it failed.
  try {
    const confirmRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Prairie Web Studio <${env.RESEND_FROM}>`,
        to: [email],
        reply_to: env.RESEND_FROM,
        subject: "Got it — thanks for reaching out to Prairie Web Studio",
        text:
          `Hi ${customerName},\n\n` +
          `Thanks for reaching out about ${business} — I'll give you a call back at ${phone} within one business day to talk through your project.\n\n` +
          `Here's what you sent, for your records:\n\n${message}\n\n` +
          `— Gavin, Prairie Web Studio`,
        html:
          `<p>Hi ${escapeHtml(customerName)},</p>` +
          `<p>Thanks for reaching out about ${escapeHtml(business)} — I'll give you a call back at ${escapeHtml(phone)} within one business day to talk through your project.</p>` +
          `<p><strong>Your message:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p>` +
          `<p>— Gavin, Prairie Web Studio</p>`,
      }),
    });

    if (!confirmRes.ok) {
      const data = await confirmRes.json().catch(() => ({}));
      console.error('Resend API error (customer confirmation)', confirmRes.status, data);
    }
  } catch (err) {
    console.error('Resend request failed (customer confirmation)', err);
  }

  return Response.json({ ok: true });
}

export async function onRequestOptions() {
  return new Response(null, { status: 405, headers: { Allow: 'POST' } });
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
