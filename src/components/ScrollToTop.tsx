import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset native scroll immediately
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Use global lenis if available
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }

    // Secondary reset after short delay to handle late-rendering content or lenis timing
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
