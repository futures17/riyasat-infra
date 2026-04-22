import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  MessageSquare,
  Star,
  LogOut,
  Menu,
  Bell,
  Moon,
  Sun,
  User,
  X,
  MapPin,
  HelpCircle,
  ClipboardCheck,
  Building2,
  BriefcaseBusiness,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardOverview } from './DashboardOverview';
import MembersAdmin from './MembersAdmin';
import MeetingsAdmin from './MeetingsAdmin';
import VisitsAdmin from './VisitsAdmin';
import ContactsAdmin from './ContactsAdmin';
import FeedbackAdmin from './FeedbackAdmin';
import ProjectInquiriesAdmin from './ProjectInquiriesAdmin';
import CareersAdmin from './CareersAdmin';
import AdminFooter from './AdminFooter';
import { clearLocalAdminSession } from '@/lib/adminSession';
import { supabase } from '@/lib/supabase';

const BookingsAdmin = () => (
  <div className="p-4 md:p-6">
    <h2 className="text-lg font-heading font-bold mb-2 text-forest-deep dark:text-white">Bookings</h2>
    <p className="text-sm text-slate-500">Manage client bookings and unit assignment forms. Coming soon.</p>
  </div>
);

const NotificationsAdmin = () => (
  <div className="p-4 md:p-6">
    <h2 className="text-lg font-heading font-bold mb-2 text-forest-deep dark:text-white">Notifications</h2>
    <p className="text-sm text-slate-500">System-wide alerts and reminders. Coming soon.</p>
  </div>
);

const HelpCenterAdmin = () => (
  <div className="p-4 md:p-6 max-w-2xl">
    <h2 className="text-lg font-heading font-bold mb-4 text-forest-deep dark:text-white">
      Help <span className="text-gold">Center</span>
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-border dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold mb-1 text-forest-deep dark:text-white">Developer Info</h3>
        <p className="text-xs text-slate-500 mb-3 italic">Hand-crafted by Pranav Sahu</p>
        <a
          href="https://pranavsahu-portfolio.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold text-forest-deep font-bold text-xs rounded-lg shadow hover:opacity-90 transition-opacity"
        >
          View Portfolio
        </a>
      </div>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-border dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold mb-1 text-forest-deep dark:text-white">Technical Support</h3>
        <p className="text-xs text-slate-500 mb-3">Issues with the SaaS infrastructure?</p>
        <a
          href="https://pranavsahu-portfolio.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-deep text-white font-bold text-xs rounded-lg hover:opacity-90 transition-opacity"
        >
          Contact Developer
        </a>
      </div>
    </div>
    <div className="bg-[#1B3B2A] text-white p-6 rounded-xl border border-gold/10 relative overflow-hidden">
      <div className="relative z-10">
        <h4 className="text-sm font-bold mb-1">System Manual</h4>
        <p className="text-cream/70 text-xs mb-4">Learn how to manage members, meetings, and referral tracking.</p>
        <button className="text-gold text-xs font-bold uppercase tracking-wider border-b border-gold/40 pb-0.5">
          Read Documentation
        </button>
      </div>
      <HelpCircle className="absolute bottom-[-16px] right-[-16px] w-28 h-28 opacity-5" />
    </div>
  </div>
);

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Schedule Meeting', path: '/admin/meetings', icon: CalendarDays },
  { name: 'Members', path: '/admin/members', icon: Users },
  { name: 'Visits', path: '/admin/visits', icon: MapPin },
  { name: 'Contacts', path: '/admin/contacts', icon: MessageSquare },
  { name: 'Project Inquiry', path: '/admin/project-inquiries', icon: Building2 },
  { name: 'Careers', path: '/admin/careers', icon: BriefcaseBusiness },
  { name: 'Bookings', path: '/admin/bookings', icon: ClipboardCheck },
  { name: 'Feedback', path: '/admin/feedback', icon: Star },
  { name: 'Notifications', path: '/admin/notifications', icon: Bell },
  { name: 'Help Center', path: '/admin/help', icon: HelpCircle },
];

interface SidebarProps {
  isExpanded: boolean;
  isMobile: boolean;
  onClose: () => void;
  currentPath: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, isMobile, onClose, currentPath, onLogout }) => (
  <div className="flex flex-col h-full bg-[#1B3B2A] border-r border-gold/10">
    <div className="h-14 px-3 flex items-center justify-between border-b border-white/5 shrink-0">
      {isExpanded || isMobile ? (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
            <img src="/src/assets/corelogo.webp" alt="R" className="w-6 h-6 object-contain" />
          </div>
          <span className="text-sm font-heading font-bold text-white tracking-wider">Riyasat</span>
        </div>
      ) : (
        <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto overflow-hidden">
          <img src="/src/assets/corelogo.webp" alt="R" className="w-6 h-6 object-contain" />
        </div>
      )}
      {isMobile && (
        <button onClick={onClose} className="text-cream/60 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>
      )}
    </div>

    <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={isMobile ? onClose : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative ${
              isActive
                ? 'bg-gold/15 text-gold'
                : 'text-cream/55 hover:text-cream hover:bg-white/5'
            } ${!isExpanded && !isMobile ? 'justify-center' : ''}`}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gold rounded-r-full" />
            )}
            <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-gold' : ''}`} style={{ width: 18, height: 18 }} />
            {(isExpanded || isMobile) && (
              <span className="text-xs font-semibold tracking-wide whitespace-nowrap">{item.name}</span>
            )}
          </Link>
        );
      })}
    </nav>

    <div className="px-2 py-3 border-t border-white/5 shrink-0">
      <button
        type="button"
        onClick={onLogout}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-cream/40 hover:text-red-400 hover:bg-red-500/10 transition-all ${
          !isExpanded && !isMobile ? 'justify-center' : ''
        }`}
      >
        <LogOut style={{ width: 18, height: 18 }} className="shrink-0" />
        {(isExpanded || isMobile) && (
          <span className="text-xs font-semibold uppercase tracking-wider">Logout</span>
        )}
      </button>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const handleLogout = useCallback(async () => {
    clearLocalAdminSession();
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore logout network issues for local admin mode.
    }
    navigate('/auth/login', { replace: true });
  }, [navigate]);

  return (
    <div className={`min-h-screen font-body transition-colors duration-300 overflow-x-hidden ${isDark ? 'dark bg-slate-950' : 'bg-slate-100'}`}>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: sidebarExpanded ? 220 : 56 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        className="hidden lg:flex fixed top-0 left-0 h-screen z-50 flex-col overflow-hidden"
      >
        <Sidebar
          isExpanded={sidebarExpanded}
          isMobile={false}
          onClose={closeMobile}
          currentPath={location.pathname}
          onLogout={handleLogout}
        />
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="mobile-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 left-0 h-screen w-64 z-[70] lg:hidden"
          >
            <Sidebar
              isExpanded={false}
              isMobile={true}
              onClose={closeMobile}
              currentPath={location.pathname}
              onLogout={handleLogout}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      <div className={`flex flex-col min-h-screen transition-all duration-200 ${sidebarExpanded ? 'lg:pl-[220px]' : 'lg:pl-[56px]'}`}>
        <header className="h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-border dark:border-white/5 flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-forest-deep dark:text-cream rounded-lg hover:bg-forest-deep/10 transition-all"
            >
              <Menu style={{ width: 18, height: 18 }} />
            </button>
            <span className="font-heading text-base font-bold text-forest-deep dark:text-white">
              Admin <span className="text-gold">Portal</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsDark((value) => !value)}
              className="p-2 text-slate-500 hover:text-gold rounded-lg transition-all"
            >
              {isDark ? <Sun style={{ width: 16, height: 16 }} /> : <Moon style={{ width: 16, height: 16 }} />}
            </button>

            <Link
              to="/admin/notifications"
              className="p-2 text-slate-500 hover:text-gold rounded-lg transition-all relative"
            >
              <Bell style={{ width: 16, height: 16 }} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10 ml-1">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 leading-none">Admin</span>
                <span className="text-[9px] text-gold font-bold uppercase tracking-wider leading-none mt-0.5">Full Access</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-forest-deep shadow">
                <User style={{ width: 15, height: 15 }} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 md:p-5 bg-slate-100 dark:bg-slate-950">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/meetings" element={<MeetingsAdmin />} />
            <Route path="/visits" element={<VisitsAdmin />} />
            <Route path="/contacts" element={<ContactsAdmin />} />
            <Route path="/project-inquiries" element={<ProjectInquiriesAdmin />} />
            <Route path="/careers" element={<CareersAdmin />} />
            <Route path="/bookings" element={<BookingsAdmin />} />
            <Route path="/feedback" element={<FeedbackAdmin />} />
            <Route path="/members" element={<MembersAdmin />} />
            <Route path="/notifications" element={<NotificationsAdmin />} />
            <Route path="/help" element={<HelpCenterAdmin />} />
          </Routes>
        </main>

        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminDashboard;
