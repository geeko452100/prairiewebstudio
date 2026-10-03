import { Route, Routes } from 'react-router';
import { MinimalLayout, SiteLayout } from './components/Layouts';
import PageHead from './components/PageHead';
import ScrollManager from './components/ScrollManager';
import Home from './pages/Home';
import Services from './pages/Services';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import Success from './pages/Success';
import NotFound from './pages/NotFound';

// Each path here also needs an entry in PAGES (src/seo.js) and ROUTES
// (scripts/prerender.js) so it gets its own static HTML file.
export default function App() {
  return (
    <>
      <PageHead />
      <ScrollManager />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route element={<MinimalLayout />}>
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
