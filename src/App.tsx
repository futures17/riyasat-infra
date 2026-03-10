import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GalleryPage from "./pages/GalleryPage";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import MasterLayoutPage from "./pages/MasterLayoutPage";
import AmenitiesPage from "./pages/AmenitiesPage";
import InvestmentPage from "./pages/InvestmentPage";
import LocationPage from "./pages/LocationPage";
import BookVisitPage from "./pages/BookVisitPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import SitemapPage from "./pages/SitemapPage";
import DeveloperPage from "./pages/DeveloperPage";
import ScrollToTop from "./components/ScrollToTop";
const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/master-layout" element={<MasterLayoutPage />} />
          <Route path="/amenities" element={<AmenitiesPage />} />
          <Route path="/investment" element={<InvestmentPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/book-visit" element={<BookVisitPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsConditionsPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/developer" element={<DeveloperPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;
