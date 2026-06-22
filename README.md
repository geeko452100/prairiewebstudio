# Snap Load Digital - Great Bend Business Website

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

- **HTML5** — Semantic landmarks (`header`, `main`, `section`, `article`, `nav`, `figure`, `address`, `fieldset`), schema.org markup, and local SEO (`src/index.html` → built `index.html`)
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

Edit **`seo.config.json`** — one file controls the title, meta description, Open Graph/Twitter tags, business schema, FAQs, and sitemap URL. Then rebuild:

```bash
npm run build:seo
```

Or run the full build (CSS + inline + SEO):

```bash
npm run build
```

The build updates `src/index.html`, `robots.txt`, and `sitemap.xml` from that config, then outputs production `index.html` with inlined CSS. Change `site.url` before going live so canonical URLs, the sitemap, and structured data all match your domain.

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

Deploy the project folder (including `assets/css/main.css`) to any static host:

- [Netlify](https://netlify.com) — drag and drop or connect Git
- [Vercel](https://vercel.com)
- [GitHub Pages](https://pages.github.com)
- [Render Static Sites](https://render.com/docs/static-sites)

Update **`seo.config.json`** (`site.url` and related fields) before going live — the build propagates your domain to the canonical tag, `robots.txt`, `sitemap.xml`, and JSON-LD.
