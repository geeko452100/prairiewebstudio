# Prairie Web Studio - Great Bend Business Website

A high-performance, static landing page built with HTML and Tailwind CSS for a local Great Bend, KS business — engineered for **100 Lighthouse scores** in Performance, Accessibility, Best Practices, and SEO.

## Quick Start

### View locally

```bash
npm install
npm run build
npx serve .
```

Open `http://localhost:3000` (or the URL `serve` prints).

### Verify Lighthouse scores

With the site running locally:

```bash
npm run build
LIGHTHOUSE_REUSE_SERVER=1 LIGHTHOUSE_URL=http://localhost:3000 npm run lighthouse
```

Or let the script start its own server:

```bash
npm run lighthouse
```

All four categories must score **100** or the command exits with an error.

### Development

Edit **`src/index.html`** for page structure and content. SEO metadata lives in **`seo.config.json`**.

Watch for CSS changes during editing:

```bash
npm run watch:css
```

After HTML or Tailwind class changes:

```bash
npm run build
```

## Built With

- **HTML5** — Semantic structure, schema.org LocalBusiness markup, and local SEO (`src/index.html` → built `index.html`)
- **Tailwind CSS** — Purged, minified, inlined production CSS (no runtime CDN compiler)
- **SVG graphics** — Crisp, lightweight illustrations with zero raster overhead
- **Vanilla JavaScript** — Deferred, idle-scheduled; no frameworks or third-party scripts

## Lighthouse-First Architecture

| Category | Technique |
|----------|-----------|
| Performance | Inlined critical CSS, system fonts, LCP image preload + reserved aspect ratio, lazy below-fold images, `content-visibility` on off-screen sections, no third-party scripts |
| Accessibility | Skip link, semantic landmarks, `inert` mobile nav, visible form errors (no `alert()`), ARIA labels, 4.5:1+ contrast, focus states |
| Best Practices | Security headers, HTTPS-ready, no deprecated APIs, explicit image dimensions |
| SEO | Central `seo.config.json`, meta + Open Graph + Twitter cards, FAQ schema, JSON-LD `@graph`, `robots.txt`, `sitemap.xml` |

## Customize SEO

SEO metadata is driven by **`seo.config.json`** and HTML templates in **`src/templates/`**:

| Template | Purpose |
|----------|---------|
| `seo-head.html` | Meta description, robots, geo tags, canonical, Open Graph, Twitter cards |
| `seo-faq.html` | FAQ section wrapper |
| `seo-faq-item.html` | Single FAQ accordion item |
| `seo-jsonld.html` | JSON-LD structured data script wrapper |

Each page is listed in `seo.config.json` under `pages` with its own title, description, canonical path, and which sections to include (FAQ, JSON-LD). The `npm run build:seo` step renders templates into every HTML file listed there.

Edit **`seo.config.json`** for page titles, descriptions, business schema, FAQs, and sitemap settings. Then rebuild:

```bash
npm run build:seo
```

Or run the full build (CSS + inline + SEO):

```bash
npm run build
```

The build updates each page's `src/*.html`, `robots.txt`, and `sitemap.xml` from that config, then outputs production `index.html` with inlined CSS. Change `site.url` before going live so canonical URLs, the sitemap, and structured data all match your domain.

To add a new page, create the HTML file with `<!-- SEO:HEAD-START -->` / `<!-- SEO:HEAD-END -->` markers (and optional FAQ/JSON-LD markers), then add an entry to the `pages` array in `seo.config.json`.

## How to Update Content

Edit **`src/index.html`** in a text editor (VS Code, Notepad, etc.):

### Business Hours & Contact Info

Search for `<!-- Contact Section -->` to update:

- Weekly operating hours
- Phone number and street address
- Google Maps link URL

### Services & Pricing

Search for `<!-- Services Section -->`:

- Change service names in `<h3>` tags
- Update descriptions and pricing in `<p>` tags

After HTML changes, rebuild CSS only if you added new Tailwind classes:

```bash
npm run build:css
```

## Modifying Styles

Edit `tailwind.config.js` for brand colors, then rebuild. Custom component classes live in `src/input.css`.

## Deployment

Deploy to [Cloudflare Pages](https://pages.cloudflare.com) (recommended) or any static host.

### Cloudflare Pages

1. Connect the repo in the Cloudflare Pages dashboard.
2. Set the build command to **`npm run build`** and the output directory to **`.`** (repo root).
3. Create a form at [Formspree](https://formspree.io) and copy your form ID.
4. Add a **`FORMSPREE_FORM_ID`** environment variable in Cloudflare Pages (or set the full URL via **`FORMSPREE_ENDPOINT`**).
5. Deploy and test the contact form on the live site.

The contact form uses `method="POST"` and submits directly from the browser to your Formspree endpoint — no backend required. The build injects the endpoint from the environment variable into the form's `action` attribute.

For local testing, set `contactForm.endpoint` or `contactForm.formId` in **`seo.config.json`**, then run `npm run build`. Do not commit real form IDs to the repo; use the Cloudflare Pages env var in production.

Stripe payment redirects in **`_redirects`** are supported automatically on Cloudflare Pages.

Update **`seo.config.json`** (`site.url` and related fields) before going live — the build propagates your domain to the canonical tag, `robots.txt`, `sitemap.xml`, and JSON-LD.
