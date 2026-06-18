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
| SEO | Meta description, canonical URL, JSON-LD, `robots.txt`, `sitemap.xml` |

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

Update the canonical URL in `index.html`, `robots.txt`, and `sitemap.xml` with your live domain before going live.
