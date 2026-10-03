import { Link } from 'react-router';
import { EMAIL } from '../site';

// Stripe Checkout redirects here after a successful payment.
export default function Success() {
  return (
    <>
      <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 ring-1 ring-brand-200" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-800">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <h1 id="success-heading" className="text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
        Thank you for your business!
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-ink-600">
        Your payment was received successfully. We appreciate your trust and look forward to working with you.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link to="/" className="btn-primary w-full sm:w-auto">Return to Home</Link>
        <a href={`mailto:${EMAIL}`} className="btn-secondary w-full sm:w-auto">Contact Us</a>
      </div>
    </>
  );
}
