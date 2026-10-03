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
  ['Customers can', 'Find you on Google, read about you, tap to call', 'Log in, pay, order, or book on their own'],
  ['Customer accounts & logins', <No />, <Yes>Secure authentication</Yes>],
  ['Online payments & booking', <No />, <Yes>Built to fit your business</Yes>],
  ['Staff dashboard', <No />, <Yes>Update menus, schedules &amp; content — no code</Yes>],
  ['Good fit for', 'Service businesses, trades & contractors', 'Restaurants, clubs & memberships, appointment-based businesses'],
];

type Plan = {
  id: string;
  title: string;
  lede: string;
  icon: string;
  features: string[];
};

type Demo = {
  href: string;
  label: string;
  title: string;
  body: string;
};

const SIMPLE_PLAN: Plan = {
  id: 'plan-simple-title',
  title: 'Simple Static Site',
  lede: 'For businesses that need a fast, professional online presence and easy content updates.',
  icon: '/assets/simple.svg',
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
  features: [
    'Custom web application',
    'Secure authentication systems',
    'Simple, straightforward development',
    'Complete transparency, nothing hidden',
    '2 free code reviews after deployment',
  ],
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
  return (
    <div className="mx-auto mt-10 max-w-md">
      <article className="pricing-card" aria-labelledby={plan.id}>
        <h3 id={plan.id} className="text-xl font-bold text-ink-900">{plan.title}</h3>
        <p className="mt-1 text-lg text-ink-600">{plan.lede}</p>
        <div className="pricing-box">
          <img src={plan.icon} alt="" width="24" height="24" />
          <FeatureList features={plan.features} />
        </div>
        <Link to="/contact" className="btn-primary pricing-cta">Get a Free Quote</Link>
      </article>
    </div>
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
            <h1 id="services-heading" className="text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Services</h1>
            <p className="mt-4 text-xl text-ink-600">
              We build two kinds of sites. The difference comes down to one question: do your customers just need to <strong>find you</strong>, or do they need to <strong>do something</strong> on your site?
            </p>
          </div>

          {/* Chooser: the two options side by side */}
          <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
            <a href="#simple" className="svc-choice svc-choice-simple">
              <span className="svc-eyebrow">Option 1 &middot; Informational</span>
              <img src="/assets/simple.svg" alt="" width="32" height="32" />
              <h2 className="text-2xl font-bold tracking-tight">Simple Site</h2>
              <p className="svc-choice-lede">Customers <strong>find you</strong> — then call or visit.</p>
              <p className="svc-choice-body">Your hours, services, and contact info on a fast site that shows up on Google.</p>
              <span className="svc-choice-link" aria-hidden="true">See Simple Sites &darr;</span>
            </a>
            <a href="#multi-layer" className="svc-choice svc-choice-multi">
              <span className="svc-eyebrow">Option 2 &middot; Interactive</span>
              <img src="/assets/build.svg" alt="" width="32" height="32" />
              <h2 className="text-2xl font-bold tracking-tight">Multi-Layer Site</h2>
              <p className="svc-choice-lede">Customers <strong>log in, pay, or book</strong> on their own.</p>
              <p className="svc-choice-body">A custom web app, plus a private dashboard where your staff manage everything.</p>
              <span className="svc-choice-link" aria-hidden="true">See Multi-Layer Sites &darr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* Side-by-side comparison */}
      <section id="compare" className="section-pad pt-0" aria-labelledby="compare-heading">
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            <h2 id="compare-heading" className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">Side by Side</h2>
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

          <PlanCard plan={SIMPLE_PLAN} />

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

          <PlanCard plan={MULTI_PLAN} />

          <h3 id="multi-projects-heading" className="mt-14 text-center text-2xl font-bold tracking-tight text-white">See a Multi-Layer Site in Action</h3>
          <p className="mt-2 text-center text-ink-200">Real, live examples — not mockups.</p>
          <div className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
            {MULTI_DEMOS.map((demo) => (
              <DemoCard key={demo.href} demo={demo} badge="Demo Web App" icon="/assets/build.svg" />
            ))}
          </div>
        </div>
      </section>

      {/* TLC Plan (optional add-on, works with either option) */}
      <section id="care-plan" className="section-pad defer-paint" aria-labelledby="care-plan-heading">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="care-plan-heading" className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">Want Us to Keep It Running?</h2>
            <p className="mt-4 text-lg text-ink-600">An optional add-on for either option. No pressure — plenty of folks are happy handling their own small edits, and you can add this anytime later.</p>
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
            <p className="mt-4 text-lg text-ink-600">Tell us what you want your customers to be able to do, and we'll tell you honestly which build fits — no pressure, no big-agency runaround.</p>
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
