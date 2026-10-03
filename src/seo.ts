// Per-page <head> tags. Used twice: scripts/prerender.js writes them into each
// page's static HTML (what Google and link previews see), and <PageHead>
// swaps them in on client-side navigation so the tab title etc. stay right.

import { EMAIL, HERO_IMAGE, HERO_IMAGE_ALT, SITE_NAME, SITE_URL } from './site';
import { FAQS } from './data/faqs';

const INDEX_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const NOINDEX_ROBOTS = 'noindex, nofollow';

const ORG_DESCRIPTION =
  'Prairie Web Studio is a Great Bend, KS web shop building fast, affordable websites and custom web applications for local businesses. Friendly web design, secure web apps, SEO, and hosting at a fair price.';

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
    title: 'Web Design & Custom Web Apps | Great Bend, KS',
    description:
      'Prairie Web Studio builds fast, affordable websites and custom web applications for small town businesses in Great Bend, Hays, and Central Kansas. Friendly web design, secure web apps, SEO, and hosting at a fair price.',
    ogTitle: 'Prairie Web Studio — Great Bend & Hays Web Design & Web Apps',
    ogDescription:
      'Friendly, fast websites and custom web applications for Great Bend, Hays, and Central Kansas businesses. Quick to load, easy to find on Google, and priced for Main Street.',
    orgDescription: ORG_DESCRIPTION,
  },
  '/services': {
    title: 'Services — Websites & Web Apps | Great Bend, KS',
    description:
      'Simple Sites for getting found, or Multi-Layer Sites (custom web apps with logins, payments & dashboards) for Great Bend, Hays & Central Kansas businesses. Compare both and see live demos.',
    ogTitle: 'Services — Great Bend & Hays, KS | Prairie Web Studio',
    ogDescription:
      'Simple Sites for getting found, or Multi-Layer Sites for logins, payments & bookings. Compare both side by side.',
    orgDescription:
      'Simple, fast static websites for Great Bend & Central Kansas businesses — honest, Main-Street pricing.',
  },
  '/faq': {
    title: 'Web Design FAQ | Great Bend, KS',
    description:
      'Answers to common questions about Prairie Web Studio — timelines, pricing, local SEO, site speed, and ownership for both static websites and custom web applications in Great Bend, Hays & Central Kansas.',
    ogTitle: 'FAQ — Great Bend & Hays, KS | Prairie Web Studio',
    ogDescription:
      'Common questions about our web design and web application process, pricing, and local SEO for Great Bend, Hays & Central Kansas businesses.',
    orgDescription:
      'Answers to common questions about Prairie Web Studio — timelines, pricing, local SEO, site speed, and ownership for both static websites and custom web applications in Great Bend.',
    faq: true,
  },
  '/contact': {
    title: 'Contact Us | Great Bend, KS',
    description:
      'Get in touch with Prairie Web Studio for a free website or web application quote. Serving Great Bend, Hays & Central Kansas — we respond within one business day.',
    ogTitle: 'Contact — Great Bend & Hays, KS | Prairie Web Studio',
    ogDescription:
      "Ready to get online, launch a custom web application, or upgrade what you've got? Serving Great Bend, Hays & Central Kansas — we respond within one business day.",
    orgDescription:
      'Get in touch with Prairie Web Studio for a free website or web application quote. Serving Great Bend & Central Kansas — we respond within one business day.',
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

const AREA_SERVED = [
  { '@type': 'City', name: 'Great Bend', containedInPlace: { '@type': 'State', name: 'KS' } },
  { '@type': 'City', name: 'Hays', containedInPlace: { '@type': 'State', name: 'KS' } },
  { '@type': 'Place', name: 'Central Kansas' },
];

// Services listed in the offer catalog. Prices are deliberately left out.
const OFFERS: [name: string, description: string][] = [
  ['Simple Static Site', 'Custom multi-page static website. Fast, search-friendly, and fully yours at launch.'],
  ['Full Custom Web Application', 'Custom web application with secure authentication and two free code reviews after deployment.'],
  ['TLC (Monthly)', 'Optional post-launch care plan for any Prairie Web Studio project, static site or web application: hosting and uptime monitoring, up to two small updates a month, and priority phone support. Cancel anytime.'],
  ['TLC (Quarterly)', 'Optional post-launch care plan for any Prairie Web Studio project billed every three months: everything in the monthly TLC plan, plus one seasonal refresh of copy, photos, and a speed/security check.'],
  ['Static Site Bug Fix — Diagnostic', 'Flat diagnostic fee to investigate a static site issue, credited toward the repair cost if you approve the quote.'],
  ['Web App Bug Fix — Diagnostic', 'Flat diagnostic fee to investigate a web application issue, credited toward the repair cost if you approve the quote.'],
  ['Minor Bug Fix', 'Flat-rate fix for a minor issue such as a typo, broken link, image swap, or styling tweak, on either a static site or web application.'],
  ['Static Site Moderate Bug Fix', 'Flat-rate fix for a moderate static site issue such as a form or feature not working correctly.'],
  ['Web App Moderate Bug Fix', 'Flat-rate fix for a moderate web application issue such as a feature or logic bug.'],
];

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
      geo: { '@type': 'GeoCoordinates', latitude: 38.3645, longitude: -98.7648 },
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
        name: 'Website & Web Application Design Services',
        itemListElement: OFFERS.map(([name, description]) => ({
          '@type': 'Offer',
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
