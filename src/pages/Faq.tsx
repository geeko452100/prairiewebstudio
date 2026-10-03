import { Link } from 'react-router';
import { FAQS } from '../data/faqs';

export default function Faq() {
  return (
    <>
      <section id="faq" className="section-pad defer-paint" aria-labelledby="faq-heading">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="faq-heading" className="text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-ink-600">Common questions about our web design and web application process, pricing, and local SEO for Great Bend businesses.</p>
          </div>
          <div className="mx-auto mt-14 max-w-3xl space-y-4">
            {FAQS.map(({ question, answer }) => (
              <details key={question} className="card group">
                <summary className="cursor-pointer text-lg font-semibold text-ink-900 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    <span>{question}</span>
                    <span className="shrink-0 text-brand-800 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </span>
                </summary>
                <p className="mt-4 text-lg text-ink-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad pt-0" aria-labelledby="faq-cta-heading">
        <div className="container-site">
          <div className="mx-auto max-w-2xl rounded-3xl border border-brand-300 bg-brand-50 p-8 text-center sm:p-12">
            <h2 id="faq-cta-heading" className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">Still have a question?</h2>
            <p className="mt-4 text-lg text-ink-600">Reach out and we'll get back to you within one business day.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-primary">Get in Touch</Link>
              <Link to="/services" className="btn-secondary">See Services</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
