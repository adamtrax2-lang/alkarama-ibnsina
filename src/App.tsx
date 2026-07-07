import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LangProvider } from "./i18n";
import { ContentProvider } from "./store";
import Navbar from "./components/Navbar";
import SocialRail from "./components/SocialRail";
import { Footer } from "./components/Sections";
import HomePage from "./pages/HomePage";
import OmraPage from "./pages/OmraPage";
import HotelsPage from "./pages/HotelsPage";
import DestinationsPage from "./pages/DestinationsPage";
import VisasPage from "./pages/VisasPage";
import BookingFormPage from "./pages/BookingFormPage";
import AdminPage from "./pages/AdminPage";

// Jump to the top of the page on route change, unless navigating to an in-page anchor (#omra etc.)
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

// The admin panel is a standalone full-screen app: no public navbar / footer / social rail.
function Shell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/omra" element={<OmraPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/visas" element={<VisasPage />} />
        <Route path="/reserver-billet" element={<BookingFormPage />} />
      </Routes>
      <Footer />
      <SocialRail />
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <ContentProvider>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </ContentProvider>
    </LangProvider>
  );
}
