// Rendered on the FAQ page and emitted as FAQPage JSON-LD from the same list,
// so the visible answers and the structured data can't drift apart.
export type Faq = { question: string; answer: string };

export const FAQS: Faq[] = [
  {
    question: 'How long does it take to launch a new website or web app?',
    answer:
      'A Simple Static Site is typically ready to launch within 7 business days after we receive your content and brand details. A Full Custom Web Application — with features like secure logins or custom functionality — usually takes 2 to 4 weeks depending on scope.',
  },
  {
    question: 'Should I get a static site or a custom web application?',
    answer:
      "Most small businesses just need to be found online and share information — that's exactly what a Simple Static Site is built for: fast, multi-page, and easy to update. If you need user accounts, secure authentication, or custom backend logic, a Full Custom Web Application is the better fit. Tell us what you need your site to do and we'll recommend the right build.",
  },
  {
    question: 'Do you only work with businesses in Great Bend?',
    answer:
      'We specialize in Great Bend and Central Kansas, but we build static sites and custom web applications remotely for clients across Kansas and beyond. Every static site includes local SEO setup tailored to your service area.',
  },
  {
    question: 'What SEO is included with every website?',
    answer:
      "Every site comes ready to be found. We write clear page titles and descriptions, add your business name, hours, and location in the format Google reads, and include a sitemap so search engines can list all your pages. If you're building a Full Custom Web Application, we make sure your public marketing pages are just as search-friendly while any logged-in areas stay private. The technical SEO is handled behind the scenes — you don't have to think about any of it.",
  },
  {
    question: 'Will my website actually load fast?',
    answer:
      'Yes. Every Simple Static Site is hand-built with clean, lightweight code instead of a bloated page-builder or theme — it should open before a customer even finishes typing your name into Google. Full Custom Web Applications get the same speed-first treatment; a feature like secure logins can add a touch of load time, but staying fast and easy to use is always the goal.',
  },
  {
    question: 'Do I own my website or web app after launch?',
    answer:
      "Yes — whether you choose a Simple Static Site or a Full Custom Web Application, it's yours to own outright once it's live, with no recurring license fees. Web application builds also include two free code reviews after deployment, and we're happy to discuss ongoing support or updates anytime after launch.",
  },
];
