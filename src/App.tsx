import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GalleryPage from "./pages/GalleryPage";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import EventsPage from "./pages/EventsPage";
import BookVisitPage from "./pages/BookVisitPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import SitemapPage from "./pages/SitemapPage";
import DeveloperPage from "./pages/DeveloperPage";
import QuotesPage from "./pages/QuotesPage";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AuthIndex from "./app/auth/index";
import LoginPage from "./app/auth/login";
import ClientSignup from "./app/auth/signup-client";
import JobsPage from "./app/auth/jobs";
import MemberSignup from "./app/auth/signup-member";
import NewMemberSignup from "./app/auth/signup-new-member";
import AdminDashboard from "./app/admin/index";
import PendingPage from "./app/member/pending";
import MemberDashboard from "./app/member/Dashboard";

declare global {
  interface Window {
    lenis?: import("lenis").default;
  }
}

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const setupLenis = async () => {
      const Lenis = (await import("lenis")).default;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      window.lenis = lenis;
      
      const raf = (time: number) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
      return () => {
        lenis.destroy();
        delete window.lenis;
      };
    };

    let cleanupLenis: (() => void) | undefined;
    setupLenis().then((cleanup) => { cleanupLenis = cleanup; });

    return () => { cleanupLenis?.(); };
  }, []);

  return (
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
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/book-visit" element={<BookVisitPage />} />
            <Route path="/book-visit/:refId" element={<BookVisitPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsConditionsPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/developer" element={<DeveloperPage />} />
            <Route path="/quotes" element={<QuotesPage />} />
            
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthIndex />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup-client" element={<ClientSignup />} />
            <Route path="/auth/jobs" element={<JobsPage />} />
            <Route path="/auth/signup-member" element={<MemberSignup />} />
            <Route path="/auth/signup-new-member" element={<NewMemberSignup />} />

            {/* Admin & Member Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route path="/member/pending" element={<PendingPage />} />
            <Route path="/member/dashboard" element={<MemberDashboard />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
