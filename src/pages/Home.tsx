import { Link } from 'react-router';

const WHY_US = [
  {
    title: 'Loads in a Snap',
    body: 'No clunky page-builders or heavy plugins — just clean, lightweight pages that open quick on any phone or computer.',
    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  },
  {
    title: 'Easy to Find on Google',
    body: 'We set things up so your Great Bend neighbors find you first — with your name, hours, and location right where Google looks.',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
  },
  {
    title: 'Works for Everyone',
    body: 'Built so every customer can use your site with ease — readable, easy to tap, and friendly to screen readers from day one.',
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  },
];

const HIGHLIGHTS = [
  ['Great Bend, KS', 'Local, Not Outsourced'],
  ['You Own It', 'No Monthly Fees'],
  ['Real Callback', 'No Call Centers'],
  ['1 Business Day', 'We Call You Back'],
];

const PATHS = [
  {
    icon: '/assets/build.svg',
    title: 'Need people to log in, pay, or book something?',
    body: 'If your business needs members to sign up, customers to pay online, or staff to manage things from a private dashboard, you need a custom web application.',
    to: '/services#multi-layer',
    cta: 'See Web App Examples',
  },
  {
    icon: '/assets/simple.svg',
    title: 'Just need customers to find you and call?',
    body: 'If you mainly need a great-looking site with your hours, services, and contact info that shows up on Google, a simple site does the job.',
    to: '/services#simple',
    cta: 'See Site Examples',
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero-country relative overflow-hidden bg-ink-900" aria-labelledby="hero-heading">
        <div className="section-pad relative">
          <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-300 bg-white px-4 py-1.5 text-sm font-medium text-brand-900">
                <span className="h-2 w-2 rounded-full bg-brand-800" aria-hidden="true" />
                Serving Great Bend &amp; Central Kansas
              </p>
              <h1 id="hero-heading" className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                Websites &amp; web apps built for
                <span className="text-brand-300"> local businesses</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-200">
                We're a Great Bend web shop that builds quick, good-looking websites and custom web applications for the folks down the street — honest prices, real conversations, and a site you'll be proud to share. No big-agency runaround.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/contact" className="btn-primary">Let's Talk About Your Project</Link>
                <Link to="/services" className="btn-secondary">See Services</Link>
              </div>
              <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-ink-200/80 pt-8 sm:gap-6">
                <div>
                  <dt className="text-sm font-medium text-ink-200">Loads Fast</dt>
                  <dd className="text-2xl font-bold text-brand-300">Every Time</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-ink-200">Launch In</dt>
                  <dd className="text-2xl font-bold text-white">7 Days+</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why-us" className="section-pad defer-paint bg-brand-900 text-white" aria-labelledby="why-heading">
        <div className="container-site">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 id="why-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">A neighbor who builds you a better website — or web app.</h2>
              <p className="mt-4 text-lg text-ink-200">A lot of small-business sites are slow, clunky, and hard to find on Google — and a custom web app can be even harder to get built without big-agency prices. We fix both, whether you need a simple site or a full custom application, at quality worth paying for and priced for Main Street.</p>

              <ul className="mt-8 space-y-5">
                {WHY_US.map(({ title, body, icon }) => (
                  <li key={title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-700/40 text-brand-300" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{icon}</svg>
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{title}</h3>
                      <p className="mt-1 text-sm text-ink-200">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-sm text-ink-200">
                Need something more than a site — logins, dashboards, custom tools?{' '}
                <Link to="/services#multi-layer" className="text-brand-300 underline underline-offset-2 hover:text-white">See our web application work &rarr;</Link>
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-4">
              {HIGHLIGHTS.map(([term, detail]) => (
                <div key={term} className="rounded-2xl border border-brand-700 bg-brand-800 p-6 text-center">
                  <dt className="text-2xl font-extrabold text-brand-300">{term}</dt>
                  <dd className="mt-1 text-sm font-medium text-ink-200">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Two paths — which kind of site does this business need */}
      <section className="section-pad defer-paint" aria-labelledby="paths-heading">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="paths-heading" className="text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">What does your business need?</h2>
            <p className="mt-4 text-lg text-ink-700">Not sure which one fits? Here's the plain-English version of both.</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            {PATHS.map(({ icon, title, body, to, cta }) => (
              <div key={to} className="card flex flex-col items-start gap-4">
                <img src={icon} alt="" width="24" height="24" />
                <div>
                  <h3 className="text-xl font-bold text-ink-900">{title}</h3>
                  <p className="mt-1 text-lg text-ink-600">{body}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to={to} className="btn-primary">{cta} &rarr;</Link>
                  <Link to="/contact" className="btn-secondary">Get a Free Quote</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
