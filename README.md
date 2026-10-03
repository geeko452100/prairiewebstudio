# Prairie Web Studio - Great Bend Business Website

The marketing site for Prairie Web Studio, a Great Bend, KS web shop. It's a **React app** (Vite + React Router + Tailwind CSS) that gets **prerendered to static HTML** at build time. Every page ships its real content and SEO tags, and React takes over in the browser. The contact form posts to a small Cloudflare Pages Function (`functions/api/contact.js`), which sends the lead through Resend.

## Quick start

```bash
npm install
npm run dev       # dev server with hot reload (client-rendered, no prerender)
npm run build     # production build + prerender -> dist/
npm run preview   # serve dist/ locally
```

`/api/contact` only exists on Cloudflare. To test the form locally, run `npx wrangler pages dev dist` after a build (put secrets in `.dev.vars`).

## Project layout

| Path | What it is |
|------|------------|
| `index.html` | Vite HTML template. Holds the site-wide `<head>` tags; per-page tags are injected at `<!--app-head-->` |
| `src/main.jsx` | Browser entry. Hydrates the prerendered HTML |
| `src/entry-server.jsx` | Build-time entry used by the prerender script |
| `src/App.jsx` | Routes (`/`, `/services`, `/faq`, `/contact`, `/success`, 404) |
| `src/pages/` | One component per page |
| `src/components/` | Header (with the mobile menu), footer, layouts, skip link, head/scroll helpers |
| `src/site.js` | Phone, email, nav links, hero image: shared business details |
| `src/seo.js` | Per-page title/description/Open Graph tags, plus the JSON-LD (business info, offer catalog without prices, FAQ schema) |
| `src/data/faqs.js` | FAQ questions and answers. Feeds both the FAQ page and its `FAQPage` JSON-LD |
| `src/index.css` | Tailwind entry plus the shared component classes (`btn-primary`, `card`, `pricing-*`, `svc-*`, …) |
| `scripts/prerender.js` | Runs after `vite build`. Renders each route to `dist/<route>/index.html` and `dist/404.html` |
| `public/` | Copied to `dist/` as-is: `assets/`, `_redirects`, `robots.txt`, `sitemap.xml`, `CNAME` |
| `functions/api/contact.js` | Cloudflare Pages Function. Validates the form and sends it with Resend |

## How to update content

- **Phone, email, nav links:** `src/site.js`. The header, footer, and contact page all pick up changes.
- **Business hours / service area:** `src/pages/Contact.jsx` (visible) and `openingHoursSpecification` in `src/seo.js` (JSON-LD).
- **Services & plans:** `src/pages/Services.jsx` (plan cards, comparison table, chooser cards) and the `OFFERS` list in `src/seo.js`. Prices are intentionally not shown anywhere on the site or in the structured data.
- **FAQ:** edit `src/data/faqs.js`. The page and the structured data both update.
- **Page titles / descriptions / social previews:** `PAGES` in `src/seo.js`.

### Adding a page

1. Create `src/pages/NewPage.jsx`.
2. Add a `<Route>` in `src/App.jsx`.
3. Add an entry to `PAGES` in `src/seo.js`.
4. Add it to `ROUTES` in `scripts/prerender.js` and to `public/sitemap.xml`.

## Styling

Tailwind is now compiled at build time from `tailwind.config.js` (brand/ink colours, shadows), so **any Tailwind class works**. You no longer have to reuse classes that already appear on the page. Shared component styles live in `src/index.css`.

## Contact form & lead alerts

`src/pages/Contact.jsx` posts JSON to `/api/contact`, which is handled by `functions/api/contact.js`. The function validates the submission, then sends two emails through [Resend](https://resend.com): a lead notification to you (reply-able straight to the customer) and a best-effort confirmation to the customer. The `_gotcha` field is a honeypot for bots.

Required Pages environment variables:

| Name | Type | Notes |
|------|------|-------|
| `RESEND_API_KEY` | secret | from resend.com/api-keys |
| `RESEND_FROM` | var | sender address. **Must be on a domain verified in Resend**, or every send fails |
| `CONTACT_TO` | var | where leads go (defaults to `ggriffith@prairiewebstudio.com`) |

## Deployment (Cloudflare Pages)

In the Pages project settings:

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Environment variables:** the three above. Pin `NODE_VERSION` to `22` if the default is older.

Pages serves `/faq` from `dist/faq/index.html` and uses `dist/404.html` for unknown URLs. `public/_redirects` holds the Stripe payment links and 301s from the old `.html` URLs (`/services.html` → `/services`, etc.) so existing links and search results keep working.
