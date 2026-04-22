import React, { useEffect } from 'react';
import { LucideShieldCheck, LucideFingerprint } from 'lucide-react';
import Navbar from '../Navbar';
import LuxuryFooter from '../LuxuryFooter';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Setup lenis smooth scroll
    const setupLenis = async () => {
      const Lenis = (await import("lenis")).default;
      const lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
      });
      lenis.scrollTo(0, { immediate: true });
      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
      return () => lenis.destroy();
    };

    let cleanupLenis: (() => void) | undefined;
    setupLenis().then((cleanup) => { cleanupLenis = cleanup; });

    return () => { cleanupLenis?.(); };
  }, []);

  return (
    <div className="min-h-screen bg-cream flex flex-col pt-24 overflow-x-hidden">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden my-12">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-pista/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Security Badge */}
        <div className="mb-8 flex items-center gap-2 px-4 py-2 bg-forest-deep/5 rounded-full border border-forest-deep/10 backdrop-blur-sm shadow-sm animate-fade-in relative z-10">
          <LucideShieldCheck className="w-4 h-4 text-forest-deep" />
          <span className="text-[10px] sm:text-xs font-medium text-forest-deep tracking-wider uppercase">
            Secure Multi-Channel Authentication
          </span>
        </div>

        {/* Main Container */}
        <div className="w-full max-w-md z-10 flex flex-col items-center">
          {/* Logo/Brand Area */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forest-deep shadow-xl shadow-forest/20 mb-6 group transition-transform hover:scale-105 duration-500 luxury-card">
              <LucideFingerprint className="w-8 h-8 text-gold-light" />
            </div>
            <h1 className="luxury-heading text-3xl sm:text-4xl mb-3">{title}</h1>
            {subtitle && (
              <p className="text-forest-light font-body text-sm sm:text-base max-w-[280px] mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Content Area */}
          <div className="w-full">
            {children}
          </div>

        </div>
      </div>

      <LuxuryFooter />
    </div>
  );
};

export default AuthLayout;
