import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { EMAIL, PHONE_DISPLAY, PHONE_HREF } from '../site';

const SUBMIT_LABEL = "Let's Get To Work";

function Required() {
  return (
    <>
      {' '}
      <span className="text-brand-800" aria-hidden="true">*</span>
      <span className="sr-only"> (required)</span>
    </>
  );
}

type InfoItemProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

function InfoItem({ icon, title, children }: InfoItemProps) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-800" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icon}</svg>
      </span>
      <div>
        <p className="font-semibold text-ink-900">{title}</p>
        {children}
      </div>
    </div>
  );
}

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = status === 'success' ? successRef.current : status === 'error' ? errorRef.current : null;
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [status]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Formspree-style honeypot: bots fill hidden fields humans never see.
    const gotcha = String(data._gotcha || '').trim();
    if (gotcha !== '') {
      setStatus('success');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: data.customerName,
          business: data.business,
          email: data.email,
          phone: data.phone,
          address: data.address,
          message: data.message,
          _gotcha: gotcha,
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      await res.json();
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="section-pad" aria-labelledby="contact-heading">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 id="contact-heading" className="text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Let's build your site or app</h1>
            <p className="mt-4 text-lg text-ink-600">Ready to get online, launch a custom web application, or upgrade what you've got? Reach out — we respond within one business day.</p>

            <address className="mt-8 space-y-4 not-italic">
              <InfoItem
                title="Phone"
                icon={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z" />}
              >
                <a href={PHONE_HREF} className="text-link">{PHONE_DISPLAY}</a>
              </InfoItem>
              <InfoItem
                title="Service Area"
                icon={
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </>
                }
              >
                <p className="text-ink-600">Great Bend &amp; Central Kansas — Fully digital agency | Consultations by appointment</p>
              </InfoItem>
              <InfoItem
                title="Business Hours"
                icon={
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </>
                }
              >
                <dl className="text-ink-600">
                  <div className="flex justify-between gap-8"><dt>Mon &hyphen; Fri</dt><dd>9:00 AM &hyphen; 5:00 PM</dd></div>
                  <div className="flex justify-between gap-8"><dt>Saturday</dt><dd>By appointment</dd></div>
                  <div className="flex justify-between gap-8"><dt>Sunday</dt><dd>Closed</dd></div>
                </dl>
              </InfoItem>
            </address>
          </div>

          <div className="space-y-6">
            {status === 'error' && (
              <div ref={errorRef} className="card border-ink-200 bg-ink-50 text-center" role="alert">
                <p className="text-lg font-semibold text-ink-900">Message not sent</p>
                <p className="mt-2 text-lg text-ink-600">
                  Something went wrong. Please email us directly at <a href={`mailto:${EMAIL}`} className="text-link">{EMAIL}</a>.
                </p>
              </div>
            )}

            <div ref={successRef} className="card border-brand-300 bg-brand-50 text-center" role="status" aria-live="polite" hidden={status !== 'success'}>
              <p className="text-lg font-semibold text-ink-900">Got it — thank you!</p>
              <p className="mt-2 text-lg text-ink-600">I'll give you a call back within one business day to talk through your project.</p>
            </div>

            <form name="contact" className="card space-y-6" onSubmit={handleSubmit} hidden={status === 'success'}>
              <p className="sr-only" aria-hidden="true">
                <label htmlFor="contact-gotcha">Leave this field empty</label>
                <input type="text" id="contact-gotcha" name="_gotcha" tabIndex={-1} autoComplete="off" />
              </p>

              <header className="space-y-1">
                <h2 id="contact-form-title" className="text-lg font-semibold text-ink-900">Tell me about your project</h2>
                <p id="contact-form-description" className="text-lg text-ink-600">
                  Leave your details and I'll give you a call back. Fields marked with an asterisk (<span aria-hidden="true">*</span>) are required.
                </p>
              </header>

              <fieldset className="space-y-5 border-0 p-0" aria-labelledby="contact-form-title" aria-describedby="contact-form-description">
                <legend className="sr-only">Contact request details</legend>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-ink-700">
                      Your name<Required />
                    </label>
                    <input type="text" id="contact-name" name="customerName" required minLength={2} maxLength={100} autoComplete="name" aria-required="true" className="field-input" />
                  </div>

                  <div>
                    <label htmlFor="contact-business" className="block text-sm font-medium text-ink-700">
                      Business name<Required />
                    </label>
                    <input type="text" id="contact-business" name="business" required minLength={2} maxLength={120} autoComplete="organization" aria-required="true" className="field-input" />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-ink-700">
                    Phone number<Required />
                  </label>
                  <input type="tel" id="contact-phone" name="phone" required maxLength={30} autoComplete="tel" inputMode="tel" aria-required="true" className="field-input" placeholder="(620) 555-0123" />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-ink-700">
                    Email<Required />
                  </label>
                  <input type="email" id="contact-email" name="email" required maxLength={200} autoComplete="email" inputMode="email" aria-required="true" className="field-input" placeholder="jane@example.com" />
                </div>

                <div>
                  <label htmlFor="contact-address" className="block text-sm font-medium text-ink-700">
                    Business location<Required />
                  </label>
                  <input type="text" id="contact-address" name="address" required maxLength={200} autoComplete="street-address" aria-required="true" className="field-input" placeholder="City, or full address if you'd like a site visit" />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-ink-700">
                    How can I help?<Required />
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    minLength={10}
                    maxLength={2000}
                    aria-required="true"
                    autoComplete="off"
                    spellCheck="true"
                    className="field-input min-h-[8rem] resize-y"
                    placeholder="Tell me a little about your business and what you need — a website, a web app, or both — I'll give you a call back."
                  />
                </div>

                <button type="submit" className="btn-primary w-full" aria-describedby="form-privacy" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : SUBMIT_LABEL}
                </button>
                <p id="form-privacy" className="text-center text-xs text-ink-600">Sent securely over HTTPS. I'll only use your details to get back to you about your project.</p>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
