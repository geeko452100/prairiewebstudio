import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { PHONE_DISPLAY, PHONE_HREF } from '../site';

const Yes = ({ children }: { children: ReactNode }) => (
  <>
    <span className="svc-yes" aria-hidden="true">✓</span> {children}
  </>
);
const No = () => (
  <>
    <span className="svc-no" aria-hidden="true">—</span>
    <span className="sr-only">Not included</span>
  </>
);

const COMPARE_ROWS: [label: string, simple: ReactNode, multi: ReactNode][] = [
  ['What it is', 'A fast, informational website', 'A custom web application'],
  ['Price', '$1,500 one-time', 'Starting at $3,000'],
  ['Customers can', 'Find you on Google, read about you, tap to call', 'Log in, pay, order, or book on their own'],
  ['Customer accounts & logins', <No />, <Yes>Secure authentication</Yes>],
  ['Online payments & booking', <No />, <Yes>Built to fit your business</Yes>],
  ['Staff dashboard', <No />, <Yes>Update menus, schedules &amp; content — no code</Yes>],
  ['Good fit for', 'Service businesses, trades & contractors', 'Restaurants, clubs & memberships, appointment-based businesses'],
];

type Price = {
  amount: string;
  prefix?: string;
  suffix?: string;
};

type Plan = {
  id: string;
  title: string;
  lede: string;
  icon: string;
  price: Price;
  features: string[];
  cta?: string;
};

type Choice = {
  href: string;
  eyebrow: string;
  icon: string;
  title: string;
  lede: ReactNode;
  body: string;
  price: string;
  link: string;
  dark?: boolean;
};

type Demo = {
  href: string;
  label: string;
  title: string;
  body: string;
};

const CHOICES: Choice[] = [
  {
    href: '#simple',
    eyebrow: 'Option 1 · Informational',
    icon: '/assets/simple.svg',
    title: 'Simple Site',
    lede: <>Customers <strong>find you</strong> — then call or visit.</>,
    body: 'Your hours, services, and contact info on a fast site that shows up on Google.',
    price: '$1,500',
    link: 'See Simple Sites',
  },
  {
    href: '#multi-layer',
    eyebrow: 'Option 2 · Interactive',
    icon: '/assets/build.svg',
    title: 'Multi-Layer Site',
    lede: <>Customers <strong>log in, pay, or book</strong> on their own.</>,
    body: 'A custom web app, plus a private dashboard where your staff manage everything.',
    price: 'Starting at $3,000',
    link: 'See Multi-Layer Sites',
    dark: true,
  },
  {
    href: '#business-email',
    eyebrow: 'Option 3 · Email & Security',
    icon: '/assets/email.svg',
    title: 'Professional Business Email & Setup',
    lede: <>Email at <strong>your own domain</strong>, set up and secured for you.</>,
    body: 'Microsoft 365 email at you@yourbusiness.com for your whole team, moved over from your old account and protected from spam and phishing.',
    price: 'From $150/mo',
    link: 'See Business Email',
  },
];

const SIMPLE_PLAN: Plan = {
  id: 'plan-simple-title',
  title: 'Simple Static Site',
  lede: 'For businesses that need a fast, professional online presence and easy content updates.',
  icon: '/assets/simple.svg',
  price: { amount: '$1,500', suffix: 'one-time' },
  features: [
    'Custom multi-page site',
    'Fast, top-scoring pages',
    'Set up to be found on Google',
    'Hosting setup & handoff docs',
    'Full ownership at launch',
  ],
};

const MULTI_PLAN: Plan = {
  id: 'plan-multi-layer-title',
  title: 'Full Custom Web Application',
  lede: 'For businesses that need logins, custom logic, or an interactive tool built just for them.',
  icon: '/assets/build.svg',
  price: { prefix: 'Starting at', amount: '$3,000', suffix: 'one-time' },
  features: [
    'Custom web application',
    'Secure authentication systems',
    'Simple, straightforward development',
    'Complete transparency, nothing hidden',
    '2 free code reviews after deployment',
  ],
};

const EMAIL_PLAN: Plan = {
  id: 'plan-email-title',
  title: 'Professional Business Email & Setup',
  lede: 'For businesses ready to trade the Gmail or Yahoo address for email that looks as professional as they are.',
  icon: '/assets/email.svg',
  price: { prefix: 'Starting at', amount: '$150', suffix: '/ month' },
  features: [
    'Microsoft 365 email at your own domain (you@yourbusiness.com)',
    'Full setup, plus migration of your old mail & contacts',
    'Shared calendars, contacts & team addresses (info@, sales@)',
    'Multi-factor authentication & sign-in protection with Microsoft Entra ID',
    'Spam, phishing & spoofing protection (SPF, DKIM & DMARC)',
    'Add or remove employees in minutes',
    'Outlook set up on your phone, laptop & desktop',
  ],
  cta: 'Get Started',
};

const SIMPLE_DEMOS: Demo[] = [
  {
    href: 'https://plumbing.prairiewebstudio.com',
    label: 'Local service business site example',
    title: 'Local Service Business',
    body: 'A fast, findable site with hours, service area, and a click-to-call number front and center — built for someone searching for help right now.',
  },
  {
    href: 'https://construction.prairiewebstudio.com',
    label: 'Trades and contractor site example',
    title: 'Trades & Contractors',
    body: 'A clean multi-page site listing services and pricing, set up so the business shows up when someone nearby searches for what they do.',
  },
];

const MULTI_DEMOS: Demo[] = [
  {
    href: 'https://eats.prairiewebstudio.com',
    label: 'Online ordering and reservations example',
    title: 'Online Ordering & Reservations',
    body: 'Customers can place online orders and book a table, while staff update the menu and daily specials themselves — no code, no waiting on a developer.',
  },
  {
    href: 'https://booking.prairiewebstudio.com',
    label: 'Client login and appointment booking example',
    title: 'Client Login & Appointment Booking',
    body: 'Customers log in to book appointments and manage their account, while staff see everything from one private dashboard.',
  },
];

const TLC_FEATURES = [
  'Hosting & uptime monitoring included',
  'Login & payment monitoring on Multi-Layer Sites',
  'Up to 2 small updates a month (text, photos, hours)',
  'Priority phone support',
  'One seasonal refresh of copy, photos & a speed/security check',
  'Cancel anytime',
];

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="pricing-features">
      {features.map((feature) => (
        <li key={feature} className="pricing-feature">
          <span className="pricing-check" aria-hidden="true">✓</span> {feature}
        </li>
      ))}
    </ul>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const { prefix, amount, suffix } = plan.price;
  return (
    <article className="pricing-card flex h-full flex-col" aria-labelledby={plan.id}>
      <h3 id={plan.id} className="text-xl font-bold text-ink-900">{plan.title}</h3>
      <p className="mt-1 text-lg text-ink-600">{plan.lede}</p>
      <p className="pricing-price">
        {prefix && <span className="pricing-price-prefix">{prefix}</span>}
        <span className="pricing-price-amount">{amount}</span>
        {suffix && <span className="pricing-price-suffix">{suffix}</span>}
      </p>
      <div className="pricing-box grow">
        <img src={plan.icon} alt="" width="24" height="24" />
        <FeatureList features={plan.features} />
      </div>
      <Link to="/contact" className="btn-primary pricing-cta">{plan.cta ?? 'Get a Free Quote'}</Link>
    </article>
  );
}

function DemoCard({ demo, badge, icon }: { demo: Demo; badge: string; icon: string }) {
  return (
    <a href={demo.href} target="_blank" rel="noopener" className="card flex flex-col gap-4" aria-label={demo.label}>
      <span className="inline-flex w-fit items-center rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700">{badge}</span>
      <div className="flex h-48 items-center justify-center rounded-xl bg-brand-50 p-6">
        <img src={icon} alt="" width="40" height="40" loading="lazy" decoding="async" />
      </div>
      <div>
        <h4 className="text-xl font-bold text-ink-900">{demo.title}</h4>
        <p className="mt-1 text-lg text-ink-600">{demo.body}</p>
      </div>
      <span className="text-link inline-flex" aria-hidden="true">Visit demo &rarr;</span>
    </a>
  );
}

export default function Services() {
  return (
    <>
      {/* Intro */}
      <section id="services-intro" className="section-pad" aria-labelledby="services-heading">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <h1 id="services-heading" className="text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Services &amp; Pricing</h1>
            <p className="mt-4 text-xl text-ink-600">
              Three packages, honest prices. Two get your business online — the question is whether your customers just need to <strong>find you</strong>, or need to <strong>do something</strong> on your site. The third gives your team professional, secure email at your own domain.
            </p>
          </div>

          {/* Chooser: all three packages at a glance */}
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-3">
            {CHOICES.map((choice) => (
              <a key={choice.href} href={choice.href} className={`svc-choice ${choice.dark ? 'svc-choice-multi' : 'svc-choice-simple'}`}>
                <span className="svc-eyebrow">{choice.eyebrow}</span>
                <img src={choice.icon} alt="" width="32" height="32" />
                <h2 className="text-2xl font-bold tracking-tight">{choice.title}</h2>
                <p className="svc-choice-lede">{choice.lede}</p>
                <p className="svc-choice-body">{choice.body}</p>
                <p className="svc-choice-price">{choice.price}</p>
                <span className="svc-choice-link" aria-hidden="true">{choice.link} &darr;</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Side-by-side comparison of the two website builds */}
      <section id="compare" className="section-pad pt-0" aria-labelledby="compare-heading">
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            <h2 id="compare-heading" className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">Simple Site vs. Multi-Layer Site</h2>
            <table className="svc-compare mt-6">
              <thead>
                <tr>
                  <td />
                  <th scope="col">Simple Site</th>
                  <th scope="col" className="svc-col-multi">Multi-Layer Site</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map(([label, simple, multi]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <td data-label="Simple Site">{simple}</td>
                    <td data-label="Multi-Layer Site" className="svc-col-multi">{multi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Option 1: Simple Sites */}
      <section id="simple" className="section-pad svc-band-simple" aria-labelledby="simple-heading">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <span className="svc-eyebrow">Option 1 &middot; Informational</span>
            <h2 id="simple-heading" className="mt-4 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Simple Sites</h2>
            <p className="mt-4 text-xl text-ink-600">For businesses that just need customers to find your hours, services, and contact info — and call or visit. Fast, findable, and the more affordable build.</p>
          </div>

          <div className="mx-auto mt-10 max-w-md">
            <PlanCard plan={SIMPLE_PLAN} />
          </div>

          <h3 id="simple-projects-heading" className="mt-14 text-center text-2xl font-bold tracking-tight text-ink-950">See a Simple Site in Action</h3>
          <p className="mt-2 text-center text-ink-600">Real, live examples — not mockups.</p>
          <div className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
            {SIMPLE_DEMOS.map((demo) => (
              <DemoCard key={demo.href} demo={demo} badge="Demo Static Site" icon="/assets/simple.svg" />
            ))}
          </div>
        </div>
      </section>

      {/* Option 2: Multi-Layer Sites */}
      <section id="multi-layer" className="section-pad svc-band-multi" aria-labelledby="multi-layer-heading">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <span className="svc-eyebrow">Option 2 &middot; Interactive</span>
            <h2 id="multi-layer-heading" className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Multi-Layer Sites</h2>
            <p className="mt-4 text-xl text-ink-200">For businesses that need customers to log in, pay, or book something themselves — and staff to manage things from a private dashboard, without calling a developer.</p>
          </div>

          <div className="mx-auto mt-10 max-w-md">
            <PlanCard plan={MULTI_PLAN} />
          </div>

          <h3 id="multi-projects-heading" className="mt-14 text-center text-2xl font-bold tracking-tight text-white">See a Multi-Layer Site in Action</h3>
          <p className="mt-2 text-center text-ink-200">Real, live examples — not mockups.</p>
          <div className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
            {MULTI_DEMOS.map((demo) => (
              <DemoCard key={demo.href} demo={demo} badge="Demo Web App" icon="/assets/build.svg" />
            ))}
          </div>
        </div>
      </section>

      {/* Option 3: Professional Business Email & Setup */}
      <section id="business-email" className="section-pad svc-band-simple" aria-labelledby="business-email-heading">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <span className="svc-eyebrow">Option 3 &middot; Email &amp; Security</span>
            <h2 id="business-email-heading" className="mt-4 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Professional Business Email &amp; Setup</h2>
            <p className="mt-4 text-xl text-ink-600">An email at your own domain tells customers you're the real deal. We set up Microsoft 365 for your whole team, move your old mail over, and lock every account down — so your messages land in inboxes, not spam folders, and nobody can send email pretending to be you.</p>
          </div>

          <div className="mx-auto mt-10 max-w-md">
            <PlanCard plan={EMAIL_PLAN} />
          </div>
        </div>
      </section>

      {/* TLC Plan (optional add-on for either website build) */}
      <section id="care-plan" className="section-pad defer-paint" aria-labelledby="care-plan-heading">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="care-plan-heading" className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">Want Us to Keep Your Site Running?</h2>
            <p className="mt-4 text-lg text-ink-600">An optional add-on for any Simple Site or Multi-Layer Site. No pressure — plenty of folks are happy handling their own small edits, and you can add this anytime later.</p>
          </div>

          <div className="mx-auto mt-10 max-w-md">
            <article className="pricing-card" aria-labelledby="plan-tlc-title">
              <div className="pricing-icon">
                <img src="/assets/icon-subscription-monthly.svg" alt="" width="32" height="32" />
              </div>
              <h3 id="plan-tlc-title" className="text-xl font-bold text-ink-900">TLC Plan</h3>
              <p className="mt-1 text-lg text-ink-600">Ongoing care after launch.</p>
              <div className="pricing-box">
                <FeatureList features={TLC_FEATURES} />
              </div>
              <Link to="/contact" className="btn-primary pricing-cta">Add to My Project</Link>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad pt-0" aria-labelledby="services-cta-heading">
        <div className="container-site">
          <div className="mx-auto max-w-2xl rounded-3xl border border-brand-300 bg-brand-50 p-8 text-center sm:p-12">
            <h2 id="services-cta-heading" className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">Not sure which one you need?</h2>
            <p className="mt-4 text-lg text-ink-600">Tell us what you want your customers — or your team — to be able to do, and we'll tell you honestly which package fits. No pressure, no big-agency runaround.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-primary">Get a Free Quote</Link>
              <a href={PHONE_HREF} className="btn-secondary">Call {PHONE_DISPLAY}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
