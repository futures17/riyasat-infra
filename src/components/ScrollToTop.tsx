import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset browser scroll
    window.scrollTo(0, 0);
    
    // Reset Lenis scroll if present (Lenis is likely used in other pages)
    // We try to find the lenis instance if it's attached to window or just rely on the page-specific resets
  }, [pathname]);

  return null;
};

export default ScrollToTop;
