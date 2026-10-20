// Per-page <head> tags. Used twice: scripts/prerender.js writes them into each
// page's static HTML (what Google and link previews see), and <PageHead>
// swaps them in on client-side navigation so the tab title etc. stay right.

import { EMAIL, HERO_IMAGE, HERO_IMAGE_ALT, SITE_NAME, SITE_URL } from './site';
import { FAQS } from './data/faqs';

const INDEX_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const NOINDEX_ROBOTS = 'noindex, nofollow';

const ORG_DESCRIPTION =
  'Prairie Web Studio is a Kansas web shop based in Wichita, with roots in Great Bend, building fast, secure websites, custom web applications, and professional business email for businesses across Kansas. Friendly web design, secure web apps, SEO, and hosting at a fair price.';

export type PageConfig = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  // Pages with this get the hero preload and the JSON-LD graph.
  orgDescription?: string;
  faq?: boolean;
  noindex?: boolean;
  // Only title, description, and robots — no canonical/OG/Twitter tags.
  minimal?: boolean;
};

export type HeadTag = {
  tag: 'title' | 'meta' | 'link' | 'script';
  attrs: Record<string, string>;
  children?: string;
};

export const PAGES: Record<string, PageConfig> = {
  '/': {
    title: 'Web Design & Custom Web Apps | Wichita, Great Bend & Kansas',
    description:
      'Based in Wichita, Prairie Web Studio builds fast, secure websites and custom web applications for businesses across Kansas — from Great Bend and Hays to small towns statewide. Honest pricing, real conversations.',
    ogTitle: 'Prairie Web Studio — Kansas Web Design & Web Apps | Wichita & Great Bend',
    ogDescription:
      'Fast, secure websites and custom applications for Kansas businesses in Wichita, Great Bend, Hays, and beyond. Honest pricing and zero big-agency runaround.',
    orgDescription: ORG_DESCRIPTION,
  },
  '/services': {
    title: 'Services & Pricing — Websites & Business Email | Wichita, KS',
    description:
      'Static websites ($1,500), custom web apps (from $3,000), and Microsoft 365 business email & setup (from $150/mo) for Wichita, Great Bend & businesses across Kansas. See pricing and live demos.',
    ogTitle: 'Services & Pricing — Wichita, Great Bend & Kansas | Prairie Web Studio',
    ogDescription:
      'Three packages with honest prices: static websites, custom web apps, and professional business email & setup.',
    orgDescription:
      'Static websites, custom web apps, and professional business email for Wichita, Great Bend & Kansas businesses — honest, Main-Street pricing.',
  },
  '/faq': {
    title: 'Web Design FAQ | Wichita & Kansas',
    description:
      'Answers to common questions about Prairie Web Studio — timelines, pricing, local SEO, site speed, and ownership for both static websites and custom web applications in Wichita, Great Bend & across Kansas.',
    ogTitle: 'FAQ — Wichita, Great Bend & Kansas | Prairie Web Studio',
    ogDescription:
      'Common questions about our web design and web application process, pricing, and local SEO for Kansas businesses in Wichita, Great Bend, Hays & beyond.',
    orgDescription:
      'Answers to common questions about Prairie Web Studio — timelines, pricing, local SEO, site speed, and ownership for both static websites and custom web applications across Kansas.',
    faq: true,
  },
  '/contact': {
    title: 'Contact Us | Wichita & Kansas Web Design',
    description:
      'Get in touch with Prairie Web Studio for a free website or web application quote. Based in Wichita, serving Great Bend, Hays & businesses across Kansas — we respond within one business day.',
    ogTitle: 'Contact — Wichita, Great Bend & Kansas | Prairie Web Studio',
    ogDescription:
      "Ready to get online, launch a custom web application, or upgrade what you've got? Serving Wichita, Great Bend & businesses across Kansas — we respond within one business day.",
    orgDescription:
      'Get in touch with Prairie Web Studio for a free website or web application quote. Serving Wichita, Great Bend & all of Kansas — we respond within one business day.',
  },
  '/success': {
    title: 'Thank You | Prairie Web Studio',
    description: 'Your payment was successful. Thank you for choosing Prairie Web Studio.',
    noindex: true,
  },
  404: {
    title: 'Page Not Found | Prairie Web Studio',
    description: "The page you're looking for doesn't exist. Head back to Prairie Web Studio's homepage.",
    noindex: true,
    minimal: true,
  },
};

export function getPage(pathname: string): PageConfig {
  return PAGES[pathname] || PAGES[404];
}

export function headTags(pathname: string): HeadTag[] {
  const page = getPage(pathname);
  const url = SITE_URL + (pathname === '/' ? '/' : pathname);
  const ogTitle = page.ogTitle || page.title;
  const ogDescription = page.ogDescription || page.description;
  const heroUrl = SITE_URL + HERO_IMAGE;

  const tags: HeadTag[] = [
    { tag: 'title', attrs: {}, children: page.title },
    { tag: 'meta', attrs: { name: 'description', content: page.description } },
    { tag: 'meta', attrs: { name: 'robots', content: page.noindex ? NOINDEX_ROBOTS : INDEX_ROBOTS } },
  ];
  if (page.minimal) return tags;

  tags.push(
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
    { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: SITE_NAME } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    { tag: 'meta', attrs: { property: 'og:title', content: ogTitle } },
    { tag: 'meta', attrs: { property: 'og:description', content: ogDescription } },
    { tag: 'meta', attrs: { property: 'og:locale', content: 'en_US' } },
    { tag: 'meta', attrs: { property: 'og:image', content: heroUrl } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: HERO_IMAGE_ALT } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: ogTitle } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: ogDescription } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: heroUrl } },
    { tag: 'meta', attrs: { name: 'twitter:image:alt', content: HERO_IMAGE_ALT } }
  );

  if (page.orgDescription) {
    tags.push({
      tag: 'link',
      attrs: { rel: 'preload', as: 'image', href: HERO_IMAGE, type: 'image/avif', fetchpriority: 'high' },
    });
    tags.push({
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      children: JSON.stringify(jsonLd(page)),
    });
  }

  return tags;
}

// Statewide service area, with the cities we're physically rooted in named
// first so they stay strong local signals.
const KANSAS = { '@type': 'State', name: 'Kansas', sameAs: 'https://en.wikipedia.org/wiki/Kansas' };
const AREA_SERVED = [
  KANSAS,
  ...['Wichita', 'Great Bend', 'Hays', 'Hutchinson', 'Salina', 'Topeka', 'Lawrence', 'Manhattan', 'Overland Park', 'Kansas City', 'Dodge City', 'Garden City'].map(
    (name) => ({ '@type': 'City', name, containedInPlace: KANSAS })
  ),
];

// Services listed in the offer catalog. Prices match the Services page; leave
// a price out when the service is quoted per project.
type OfferPrice = { price: number } | { minPrice: number; monthly?: true };
const OFFERS: [name: string, description: string, price?: OfferPrice][] = [
  ['Simple Static Site', 'Custom multi-page static website. Fast, search-friendly, and fully yours at launch.', { price: 1500 }],
  ['Full Custom Web Application', 'Custom web application with secure authentication and two free code reviews after deployment.', { minPrice: 3000 }],
  ['Professional Business Email & Setup', 'Microsoft 365 email at your own domain for your whole team: full setup, migration from your old account, shared calendars, multi-factor authentication with Microsoft Entra ID, and spam, phishing, and spoofing protection (SPF, DKIM, DMARC).', { minPrice: 150, monthly: true }],
  ['TLC (Monthly)', 'Optional post-launch care plan for any Prairie Web Studio project, static site or web application: hosting and uptime monitoring, up to two small updates a month, and priority phone support. Cancel anytime.'],
  ['TLC (Quarterly)', 'Optional post-launch care plan for any Prairie Web Studio project billed every three months: everything in the monthly TLC plan, plus one seasonal refresh of copy, photos, and a speed/security check.'],
  ['Static Site Bug Fix — Diagnostic', 'Flat diagnostic fee to investigate a static site issue, credited toward the repair cost if you approve the quote.'],
  ['Web App Bug Fix — Diagnostic', 'Flat diagnostic fee to investigate a web application issue, credited toward the repair cost if you approve the quote.'],
  ['Minor Bug Fix', 'Flat-rate fix for a minor issue such as a typo, broken link, image swap, or styling tweak, on either a static site or web application.'],
  ['Static Site Moderate Bug Fix', 'Flat-rate fix for a moderate static site issue such as a form or feature not working correctly.'],
  ['Web App Moderate Bug Fix', 'Flat-rate fix for a moderate web application issue such as a feature or logic bug.'],
];

function offerPrice(price?: OfferPrice) {
  if (!price) return {};
  if ('price' in price) return { price: price.price, priceCurrency: 'USD' };
  const monthly = price.monthly ? { unitCode: 'MON', unitText: 'month' } : {};
  return {
    priceSpecification: { '@type': 'UnitPriceSpecification', minPrice: price.minPrice, priceCurrency: 'USD', ...monthly },
  };
}

function jsonLd(page: PageConfig) {
  const orgId = `${SITE_URL}/#organization`;
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: page.orgDescription,
      inLanguage: 'en',
      publisher: { '@id': orgId },
    },
    {
      '@type': 'ProfessionalService',
      '@id': orgId,
      name: SITE_NAME,
      description: page.orgDescription,
      url: SITE_URL,
      email: EMAIL,
      image: SITE_URL + HERO_IMAGE,
      logo: `${SITE_URL}/assets/logo.svg`,
      priceRange: '$$',
      areaServed: AREA_SERVED,
      // Service-area business: city-level address only, no street.
      address: { '@type': 'PostalAddress', addressLocality: 'Wichita', addressRegion: 'KS', addressCountry: 'US' },
      geo: { '@type': 'GeoCoordinates', latitude: 37.6872, longitude: -97.3301 },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '17:00',
        },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Website, Web Application & Business Email Services',
        itemListElement: OFFERS.map(([name, description, price]) => ({
          '@type': 'Offer',
          ...offerPrice(price),
          itemOffered: {
            '@type': 'Service',
            name,
            description,
            provider: { '@id': orgId },
            areaServed: AREA_SERVED,
          },
        })),
      },
    },
  ];

  if (page.faq) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/faq#faq`,
      mainEntity: FAQS.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

const escapeHtml = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Serialises headTags() for the prerendered HTML. Every tag gets data-head so
// the client knows which ones to replace on navigation.
export function headTagsToHtml(tags: HeadTag[]): string {
  return tags
    .map(({ tag, attrs, children }) => {
      const attrStr = Object.entries(attrs)
        .map(([k, v]) => ` ${k}="${escapeHtml(v)}"`)
        .join('');
      const open = `<${tag} data-head${attrStr}>`;
      if (tag === 'meta' || tag === 'link') return open;
      // JSON-LD must not be HTML-escaped, but a literal "</script" would end the tag early.
      const body = tag === 'script' ? (children ?? '').replace(/<\//g, '<\\/') : escapeHtml(children ?? '');
      return `${open}${body}</${tag}>`;
    })
    .join('\n    ');
}
