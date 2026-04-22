import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { getPortalAccess } from "@/lib/portalAuth";
import { hasLocalAdminSession } from "@/lib/adminSession";

type GuardState = "loading" | "allowed" | "denied";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const location = useLocation();
  const [guardState, setGuardState] = useState<GuardState>("loading");

  useEffect(() => {
    let isMounted = true;

    const verifyAdminAccess = async () => {
      try {
        if (hasLocalAdminSession()) {
          if (isMounted) {
            setGuardState("allowed");
          }
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (isMounted) {
            setGuardState("denied");
          }
          return;
        }

        const access = await getPortalAccess(session.user);

        if (!access.isAdmin) {
          await supabase.auth.signOut();
          if (isMounted) {
            toast.error("Admin access required.");
            setGuardState("denied");
          }
          return;
        }

        if (isMounted) {
          setGuardState("allowed");
        }
      } catch {
        if (isMounted) {
          setGuardState("denied");
        }
      }
    };

    verifyAdminAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  if (guardState === "loading") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          <div>
            <p className="text-base font-heading font-bold text-forest-deep">Verifying Admin Access</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mt-1">Secure session check</p>
          </div>
        </div>
      </div>
    );
  }

  if (guardState === "denied") {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
