const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const configPath = path.join(root, 'seo.config.json');
const htmlPath = path.join(root, 'index.html');
const robotsPath = path.join(root, 'robots.txt');
const sitemapPath = path.join(root, 'sitemap.xml');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const { site, meta, business, services, faqs, sitemap } = config;

const siteUrl = site.url.replace(/\/$/, '');
const canonical = `${siteUrl}/`;
const today = new Date().toISOString().slice(0, 10);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

function buildHeadBlock() {
  const twitterTags = meta.twitterHandle
    ? `  <meta name="twitter:site" content="${escapeHtml(meta.twitterHandle)}">\n`
    : '';

  return `<!-- SEO:HEAD-START -->
  <meta name="description" content="${escapeHtml(meta.description)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="${escapeHtml(meta.themeColor)}">
  <meta name="geo.region" content="${escapeHtml(business.areaServed.country + '-' + business.areaServed.region)}">
  <meta name="geo.placename" content="${escapeHtml(business.areaServed.name)}">
  <meta name="ICBM" content="${business.geo.latitude}, ${business.geo.longitude}">
  <link rel="canonical" href="${canonical}">
  <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml">
  <link rel="apple-touch-icon" href="./assets/favicon.svg">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeHtml(site.name)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${escapeHtml(meta.ogTitle)}">
  <meta property="og:description" content="${escapeHtml(meta.ogDescription)}">
  <meta property="og:locale" content="${escapeHtml(site.locale)}">
  <meta property="og:image" content="${escapeHtml(meta.ogImage)}">
  <meta property="og:image:alt" content="${escapeHtml(meta.ogImageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
${twitterTags}  <meta name="twitter:title" content="${escapeHtml(meta.ogTitle)}">
  <meta name="twitter:description" content="${escapeHtml(meta.ogDescription)}">
  <meta name="twitter:image" content="${escapeHtml(meta.ogImage)}">
  <meta name="twitter:image:alt" content="${escapeHtml(meta.ogImageAlt)}">
<!-- SEO:HEAD-END -->`;
}

function buildFaqBlock() {
  const items = faqs
    .map(
      (faq) => `          <details class="card group">
            <summary class="cursor-pointer text-lg font-semibold text-ink-900 marker:content-none [&::-webkit-details-marker]:hidden">
              <span class="flex items-start justify-between gap-4">
                <span>${escapeHtml(faq.question)}</span>
                <span class="shrink-0 text-brand-800 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </span>
            </summary>
            <p class="mt-4 text-ink-600">${escapeHtml(faq.answer)}</p>
          </details>`
    )
    .join('\n');

  return `<!-- SEO:FAQ-START -->
    <section id="faq" class="section-pad defer-paint" aria-labelledby="faq-heading">
      <div class="container-site">
        <div class="mx-auto max-w-2xl text-center">
          <h2 id="faq-heading" class="text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Frequently Asked Questions</h2>
          <p class="mt-4 text-lg text-ink-600">Common questions about our web design process, pricing, and local SEO for Great Bend businesses.</p>
        </div>
        <div class="mx-auto mt-14 max-w-3xl space-y-4">
${items}
        </div>
      </div>
    </section>
<!-- SEO:FAQ-END -->`;
}

function buildJsonLd() {
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

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: site.name,
        description: meta.description,
        inLanguage: site.language,
        publisher: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': business.type,
        '@id': `${siteUrl}/#organization`,
        name: site.name,
        description: meta.description,
        url: siteUrl,
        email: business.email,
        image: meta.ogImage,
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
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return `<!-- SEO:JSONLD-START -->
  <script type="application/ld+json">
${JSON.stringify(graph, null, 2)}
  </script>
<!-- SEO:JSONLD-END -->`;
}

let html = fs.readFileSync(htmlPath, 'utf8');

const titleMatch = html.match(/<title>[^<]*<\/title>/);
if (titleMatch) {
  html = html.replace(titleMatch[0], `<title>${escapeHtml(meta.title)}</title>`);
}

html = replaceBlock(html, '<!-- SEO:HEAD-START -->', '<!-- SEO:HEAD-END -->', buildHeadBlock());
html = replaceBlock(html, '<!-- SEO:FAQ-START -->', '<!-- SEO:FAQ-END -->', buildFaqBlock());
html = replaceBlock(html, '<!-- SEO:JSONLD-START -->', '<!-- SEO:JSONLD-END -->', buildJsonLd());

fs.writeFileSync(htmlPath, html);

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
fs.writeFileSync(robotsPath, robots);

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${canonical}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${sitemap.changefreq}</changefreq>
    <priority>${sitemap.priority}</priority>
  </url>
</urlset>
`;
fs.writeFileSync(sitemapPath, sitemapXml);

console.log('Applied SEO config to index.html, robots.txt, and sitemap.xml');
