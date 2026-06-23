const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const configPath = path.join(root, 'seo.config.json');
const templatesDir = path.join(root, 'src', 'templates');
const robotsPath = path.join(root, 'robots.txt');
const sitemapPath = path.join(root, 'sitemap.xml');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const { site, defaults, business, services, faqs, pages } = config;

const siteUrl = site.url.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function loadTemplate(name) {
  return fs.readFileSync(path.join(templatesDir, name), 'utf8');
}

function renderTemplate(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in values)) {
      console.warn(`Template placeholder missing value: {{${key}}}`);
      return '';
    }
    return values[key];
  });
}

function replaceBlock(content, startMarker, endMarker, replacement) {
  const start = content.indexOf(startMarker);
  const end = content.indexOf(endMarker);
  if (start === -1 || end === -1) {
    console.error(`Missing markers: ${startMarker} / ${endMarker}`);
    process.exit(1);
  }
  return content.slice(0, start) + replacement + content.slice(end + endMarker.length);
}

function buildHeadBlock(page) {
  const canonical = `${siteUrl}${page.path === '/' ? '/' : page.path}`;
  const twitterSite = defaults.twitterHandle
    ? `  <meta name="twitter:site" content="${escapeHtml(defaults.twitterHandle)}">\n`
    : '';

  return renderTemplate(loadTemplate('seo-head.html'), {
    description: escapeHtml(page.description),
    robots: escapeHtml(
      page.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    ),
    themeColor: escapeHtml(defaults.themeColor),
    geoRegion: escapeHtml(`${business.areaServed.country}-${business.areaServed.region}`),
    geoPlacename: escapeHtml(business.areaServed.name),
    geoCoordinates: `${business.geo.latitude}, ${business.geo.longitude}`,
    canonical,
    preloadImage: escapeHtml(page.preloadImage || './assets/hero-illustration.svg'),
    siteName: escapeHtml(site.name),
    ogTitle: escapeHtml(page.ogTitle),
    ogDescription: escapeHtml(page.ogDescription),
    locale: escapeHtml(site.locale),
    ogImage: escapeHtml(page.ogImage || defaults.ogImage),
    ogImageAlt: escapeHtml(page.ogImageAlt || defaults.ogImageAlt),
    twitterSite,
  }).trimEnd();
}

function buildFaqBlock() {
  const itemTemplate = loadTemplate('seo-faq-item.html');
  const faqItems = faqs
    .map((faq) =>
      renderTemplate(itemTemplate, {
        question: escapeHtml(faq.question),
        answer: escapeHtml(faq.answer),
      })
    )
    .join('\n');

  return renderTemplate(loadTemplate('seo-faq.html'), {
    faqIntro: escapeHtml(defaults.faqIntro),
    faqItems,
  }).trimEnd();
}

function buildJsonLd(page) {
  const canonical = `${siteUrl}${page.path === '/' ? '/' : page.path}`;
  const pageUrl = page.path === '/' ? siteUrl : `${siteUrl}${page.path}`;

  const openingHoursSpecification = business.openingHours.map((entry) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: entry.days,
    opens: entry.opens,
    closes: entry.closes,
  }));

  const offers = services.map((service) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: service.name,
      description: service.description,
      provider: { '@id': `${siteUrl}/#organization` },
      areaServed: {
        '@type': 'City',
        name: business.areaServed.name,
        containedInPlace: {
          '@type': 'State',
          name: business.areaServed.region,
        },
      },
    },
    price: service.price,
    priceCurrency: service.priceCurrency,
  }));

  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: site.name,
      description: page.description,
      inLanguage: site.language,
      publisher: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': business.type,
      '@id': `${siteUrl}/#organization`,
      name: site.name,
      description: page.description,
      url: siteUrl,
      email: business.email,
      image: page.ogImage || defaults.ogImage,
      logo: `${siteUrl}/assets/logo.svg`,
      priceRange: business.priceRange,
      areaServed: {
        '@type': 'City',
        name: business.areaServed.name,
        containedInPlace: {
          '@type': 'State',
          name: business.areaServed.region,
        },
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: business.geo.latitude,
        longitude: business.geo.longitude,
      },
      openingHoursSpecification,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Website Design Services',
        itemListElement: offers,
      },
    },
  ];

  if (page.sections && page.sections.faq) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);

  return renderTemplate(loadTemplate('seo-jsonld.html'), { jsonLd }).trimEnd();
}

function applyPageSeo(page) {
  const htmlPath = path.join(root, page.html);
  let html = fs.readFileSync(htmlPath, 'utf8');

  const titleMatch = html.match(/<title>[^<]*<\/title>/);
  if (titleMatch) {
    html = html.replace(titleMatch[0], `<title>${escapeHtml(page.title)}</title>`);
  }

  html = replaceBlock(html, '<!-- SEO:HEAD-START -->', '<!-- SEO:HEAD-END -->', buildHeadBlock(page));

  if (page.sections && page.sections.faq) {
    html = replaceBlock(html, '<!-- SEO:FAQ-START -->', '<!-- SEO:FAQ-END -->', buildFaqBlock());
  }

  if (page.sections && page.sections.jsonld) {
    html = replaceBlock(html, '<!-- SEO:JSONLD-START -->', '<!-- SEO:JSONLD-END -->', buildJsonLd(page));
  }

  fs.writeFileSync(htmlPath, html);
  console.log(`Applied SEO templates to ${page.html}`);
}

pages.forEach(applyPageSeo);

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
fs.writeFileSync(robotsPath, robots);

const sitemapEntries = pages
  .filter((page) => page.sitemap)
  .map((page) => {
    const loc = `${siteUrl}${page.path === '/' ? '/' : page.path}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.sitemap.changefreq}</changefreq>
    <priority>${page.sitemap.priority}</priority>
  </url>`;
  })
  .join('\n');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;
fs.writeFileSync(sitemapPath, sitemapXml);

console.log(`Updated robots.txt and sitemap.xml (${pages.length} page${pages.length === 1 ? '' : 's'})`);
