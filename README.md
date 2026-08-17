# Prairie Web Studio - Great Bend Business Website

A static HTML + Tailwind CSS marketing site for Prairie Web Studio, a Great Bend, KS web shop — built to load fast, rank well, and stay accessible. The contact form submits client-side to the Prairie Dispatch Engine, an external service — there's no backend in this repo.

## How this repo actually works

There's no build step in this checkout — `index.html`, `services.html`, `faq.html`, `contact.html`, and `success.html` at the repo root **are** the live source files. Tailwind's compiled CSS is already inlined directly into each page's `<style>` block (between `<!-- BUILD:CSS-START -->` / `<!-- BUILD:CSS-END -->`), so there's nothing to run before deploying.

This matters when editing:

- **Reuse existing utility classes.** If a Tailwind class (e.g. `mt-3`, `object-contain`) isn't already used somewhere on the page, it has no matching rule in the inlined `<style>` block and will silently do nothing. Check the class exists elsewhere in the file first, or fall back to an inline `style="..."` attribute, which always works regardless of what's compiled.
- **All four pages share near-identical `<head>`, header, and footer markup.** There's no templating — changes to shared chrome (nav links, footer, JSON-LD business info) need to be copied into each HTML file by hand.
- **`package.json` still lists `build`, `build:css`, `build:seo`, etc.**, and `seo.config.json` describes per-page SEO data, but the `src/` and `scripts/` directories those commands depend on aren't present in this repo, so those scripts will fail if run. Treat `seo.config.json` as reference/history, not as something that currently drives the pages — SEO meta tags, JSON-LD, and FAQ schema are hand-maintained directly in each HTML file's `<!-- SEO:HEAD-START -->` / `<!-- SEO:FAQ-START -->` / `<!-- SEO:JSONLD-START -->` blocks.

### View locally

```bash
npx serve .
```

Open the URL `serve` prints. This serves the static files as-is — no build required.

## Built With

- **HTML5** — Semantic structure, schema.org `LocalBusiness`/`ProfessionalService` markup, local SEO meta tags
- **Tailwind CSS** — Pre-compiled and inlined per page (no runtime CDN compiler, no live build step)
- **SVG graphics** — Crisp, lightweight illustrations with zero raster overhead
- **Vanilla JavaScript** (`main.js`) — Deferred `<script type="module">`; handles the mobile nav toggle and the contact form's submit flow
- **Prairie Dispatch Engine** — external SDK (loaded via `<script src="https://dispatch.prairiewebstudio.com/v1/prairie-dispatch.js">` in `contact.html`) that the contact form submits to directly from the browser; no backend code lives in this repo

## Site Structure

| File | Purpose |
|------|---------|
| `index.html` | Homepage — hero, why-us, "what does your business need" paths |
| `services.html` | Pricing (Simple Static Site vs. Full Custom Web Application), Care Plans, and pay-as-you-go Bug Fixes |
| `work.html` | Portfolio — live client web apps and static-site demos |
| `faq.html` | FAQ accordion with matching `FAQPage` JSON-LD |
| `contact.html` | Contact form + business info (phone, hours, service area) |
| `success.html` | Post-payment landing page (Stripe redirect target) |
| `main.js` | Shared vanilla JS: mobile nav toggle, contact form submission via Prairie Dispatch Engine |
| `assets/` | Logos, icons, and photos (`.avif`/`.svg`) |
| `_redirects` | Stripe payment link redirects (`/payment` → Stripe Checkout URLs) |
| `robots.txt`, `sitemap.xml` | Hand-maintained, not generated |

There's no `functions/` directory in this repo — the contact form has no backend here (see Contact Form section below).

## How to Update Content

Edit the relevant page directly (e.g. `index.html`, `services.html`) in a text editor.

### Business Hours & Contact Info

Update in `contact.html` — search for `<address` for hours, phone, and service area. The same phone number and hours also appear in the JSON-LD block (`<!-- SEO:JSONLD-START -->`) near the bottom of every page and in the header's "Call" button — update all instances together.

### Services & Pricing

Edit `services.html` — search for `id="services"`. Update plan names in `<h2>` tags, features in `<li class="pricing-feature">`, and prices in `<p class="pricing-amount">`. Prices are also listed in the JSON-LD `hasOfferCatalog` block on every page — keep those in sync manually.

### FAQ

Edit `faq.html` — each question is a `<details class="card group">` block. The visible answer and the `FAQPage` JSON-LD entry at the bottom of the file are separate; update both when adding, removing, or editing a question.

## Modifying Styles

Because CSS is pre-compiled and inlined, there's no `tailwind.config.js` rebuild step wired up in this repo. To add new styling:

1. Prefer reusing a utility class that's already present somewhere on the same page.
2. For anything not already compiled (spacing values, new colors, etc.), use an inline `style="..."` attribute — it always renders regardless of the missing build pipeline.
3. Small custom rules (like the page background image, or hero gradient overlays) live in the page's second `<style>` block, right after the `<!-- BUILD:CSS-END -->` marker — add plain CSS there if a rule needs to apply broadly across a page.

`tailwind.config.js` and the `src/input.css` referenced by `package.json`'s `build:css` script describe the intended source-of-truth setup but aren't present here; if that pipeline gets restored later, this section should be rewritten to match.

## Contact Form & Lead Alerts

The contact form (`contact.html`) submits client-side via the [Prairie Dispatch Engine](https://github.com/geeko452100/Dispatcher-Micro-Plugin) SDK — a `<script src="https://dispatch.prairiewebstudio.com/v1/prairie-dispatch.js">` tag loaded in `contact.html`, initialized in `main.js`'s `initContactForm()`. **There's no backend code in this repo** — the SDK is tied to this business's tenant API key, hardcoded directly in `main.js`. The dispatch engine relays each lead as a text to the tenant's `veriphoneGateway` and sends email from `ggriffith@prairiewebstudio.com` (this tenant's `resendFrom` override). To change how leads are delivered (a different phone/email, honeypot behavior, etc.), that's configured on the dispatch engine's side, not in this repo.

The form still includes a `_gotcha` honeypot field that `main.js` checks client-side before calling the dispatch SDK, to silently drop obvious bot submissions.

## Deployment

Deploy to [Cloudflare Pages](https://pages.cloudflare.com).

1. Connect the repo in the Cloudflare Pages dashboard.
2. Leave the build command empty (or `true`/no-op) and set the output directory to **`.`** (repo root) — there's nothing to build.
3. Deploy and test the contact form on the live site — since the dispatch engine is external, a successful local test still requires network access to `dispatch.prairiewebstudio.com`.

Stripe payment redirects in `_redirects` are supported automatically on Cloudflare Pages. `CNAME` pins the custom domain for GitHub Pages-style hosting if that's ever used instead; Cloudflare Pages manages its own custom domain configuration separately in the dashboard.

`seo.config.json` documents `site.url` and related fields as reference, but — per the note above — nothing in this repo currently reads it. The canonical tags, `robots.txt`, `sitemap.xml`, and JSON-LD blocks in each HTML file are the actual source of truth and are updated by hand.
