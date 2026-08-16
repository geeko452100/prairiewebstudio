import { sendLeadEmail } from "../_lib/email";
import { sendLeadSms } from "../_lib/emailToSms";

const BUSINESS_EMAIL = "ggriffith@prairiewebstudio.com";

const FIELD_LIMITS = {
  name: { min: 2, max: 100 },
  business: { min: 2, max: 120 },
  phone: { min: 1, max: 30 },
  message: { min: 10, max: 2000 },
} as const;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const form = await request.formData();

  // Formspree-style honeypot: bots fill hidden fields humans never see.
  // Report success without sending anything so bots don't learn to avoid it.
  if (String(form.get("_gotcha") ?? "").trim() !== "") {
    return jsonResponse({ ok: true });
  }

  const name = String(form.get("name") ?? "").trim();
  const business = String(form.get("business") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  for (const [key, value] of Object.entries({ name, business, phone, message })) {
    const limits = FIELD_LIMITS[key as keyof typeof FIELD_LIMITS];
    if (value.length < limits.min || value.length > limits.max) {
      return jsonResponse({ ok: false, error: `Invalid ${key}` }, 400);
    }
  }

  const lead = { name, business, phone, message };

  const [emailResult, smsResult] = await Promise.allSettled([
    sendLeadEmail(env.RESEND_API_KEY, BUSINESS_EMAIL, lead),
    sendLeadSms(env.RESEND_API_KEY, lead),
  ]);

  if (emailResult.status === "rejected" || emailResult.value.error) {
    const detail = emailResult.status === "rejected" ? emailResult.reason : emailResult.value.error;
    console.error("Resend lead email failed", detail);
    return jsonResponse({ ok: false, error: "Could not send your message. Please call instead." }, 502);
  }

  if (smsResult.status === "rejected" || smsResult.value.error) {
    const detail = smsResult.status === "rejected" ? smsResult.reason : smsResult.value.error;
    console.error("Resend lead SMS alert failed", detail);
    // Not fatal -- the lead email above already succeeded, so the lead isn't lost.
  }

  return jsonResponse({ ok: true });
};
