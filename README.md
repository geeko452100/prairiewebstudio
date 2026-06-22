# Snap Load Digital - Great Bend Business Website

A high-performance, static landing page built with HTML and Tailwind CSS for a local Great Bend, KS business — engineered for 100% Google Lighthouse scores.

## Quick Start

### View locally (no build)

1. Build CSS first (one-time): `npm install && npm run build:css`
2. Open `index.html` in any modern browser, or serve the folder:

```bash
npx serve .
```

### Development

Watch for CSS changes during editing:

```bash
npm run watch:css
```

## Built With

- **HTML5** — Semantic structure, schema.org LocalBusiness markup, and local SEO
- **Tailwind CSS** — Purged, minified production CSS (no runtime CDN compiler)
- **SVG graphics** — Crisp, lightweight illustrations with zero raster overhead
- **Vanilla JavaScript** — Under 10 lines for mobile navigation only

## Lighthouse Optimizations

| Category | Technique |
|----------|-----------|
| Performance | Purged CSS, system fonts, preloaded LCP image, no third-party scripts |
| Accessibility | Skip link, semantic landmarks, ARIA labels, 4.5:1+ contrast, focus states |
| Best Practices | HTTPS-ready, no deprecated APIs, `rel="noopener"` on external links |
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

The build updates `index.html`, `robots.txt`, and `sitemap.xml` from that config. Change `site.url` before going live so canonical URLs, the sitemap, and structured data all match your domain.

## How to Update Content

Open `index.html` in a text editor (VS Code, Notepad, etc.):

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
