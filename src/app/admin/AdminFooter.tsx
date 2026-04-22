import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, LayoutDashboard, LogOut, HelpCircle, Bell, Home, ShieldCheck } from 'lucide-react';
import footerLogo from '../../assets/footerlogo.webp';

const AdminFooter: React.FC = () => {
  return (
    <footer className="bg-[#1B3B2A] border-t border-gold/20 text-cream/60">
      {/* Main row */}
      <div className="max-w-full px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-3">

        {/* Left: Riyasat Logo & Hexatom */}
        <div className="flex items-center gap-3 shrink-0">
          <img src={footerLogo} alt="Riyasat Infra" className="h-6 md:h-8 object-contain" />
          <div className="h-4 w-px bg-gold/20" />
          <div className="flex items-center gap-2">
            {/* Hexatom placeholder/image (using default path if user drops hexatom logo inside public) */}
            <img src="/hexatom.png" alt="Hexatom" className="h-4 md:h-5 object-contain" onError={(e) => { e.currentTarget.style.display='none'; }} />
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xs font-bold text-gold tracking-widest leading-none mt-1">HEXATOM</span>
              <span className="text-[7px] text-cream/40 uppercase tracking-[0.2em]">Partner</span>
            </div>
          </div>
        </div>

        {/* System nav links */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-black/20 rounded-md border border-gold/10">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span className="text-[8px] md:text-[9px] font-mono text-emerald-400/80 uppercase tracking-widest">sequrity vestion 2.4.5 ai ingtergrated</span>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] md:text-xs font-semibold text-cream/50 hover:text-gold transition-colors ml-2"
          >
            <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5" />
            Live Site
          </a>
          <Link
            to="/"
            className="flex items-center gap-1 text-[10px] md:text-xs font-semibold text-cream/50 hover:text-gold transition-colors"
          >
            <Home className="w-3 h-3 md:w-3.5 md:h-3.5" />
            Home
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-1 text-[10px] md:text-xs font-semibold text-cream/50 hover:text-gold transition-colors"
          >
            <LayoutDashboard className="w-3 h-3 md:w-3.5 md:h-3.5" />
            Dashboard
          </Link>
        </div>

        {/* Right: Copyright & Pranav */}
        <div className="flex flex-col items-center md:items-end text-[9px] shrink-0 gap-1">
          <p className="text-cream/25 uppercase tracking-widest">
            © 2026 Riyasat Infra
          </p>
          <p className="text-gold/40 tracking-wider">
            Built by <span className="font-bold text-gold/80">Pranav Sahu</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default AdminFooter;
