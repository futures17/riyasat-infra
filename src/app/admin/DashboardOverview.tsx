import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, MapPin, Users, Calendar, CheckCircle, MessageSquare, ArrowUpRight, TrendingUp, Link, Database } from 'lucide-react';
import { supabase, type Visit } from '../../lib/supabase';
import quotes from '../../data/quotes.json';
import { Link as RouterLink } from 'react-router-dom';

const itemVariants = {
  hidden:  { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 220 } as const },
};

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

export const DashboardOverview = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [stats, setStats] = useState({ totalMembers: 0, pendingMembers: 0, todayVisits: 0, newContacts: 0 });
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real stats from Supabase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const today = new Date().toISOString().split('T')[0];

        const [
          { count: membersCount },
          { count: pendingCount },
          { count: visitsCount },
          { count: contactsCount },
          { data: visitsData }
        ] = await Promise.all([
          supabase.from('members').select('*', { count: 'exact', head: true }),
          supabase.from('members').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('visits').select('*', { count: 'exact', head: true }).eq('preferred_date', today),
          supabase.from('contacts').select('*', { count: 'exact', head: true }),
          supabase.from('visits').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        setStats({
          totalMembers:   membersCount  || 0,
          pendingMembers: pendingCount  || 0,
          todayVisits:    visitsCount   || 0,
          newContacts:    contactsCount || 0,
        });
        setRecentVisits((visitsData as Visit[]) || []);
      } catch (err) {
        console.error('Dashboard stats fetch failed', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Sequential quote rotation (2 per day, every 12 hours)
  // HANDOVER RESET: Change the 'handoverDate' to the current date when delivering to the client.
  useEffect(() => {
    const update = () => {
      const handoverDate = new Date('2026-04-06T00:00:00Z').getTime(); 
      const elapsed = Math.max(0, Date.now() - handoverDate);
      const intervalsOf12H = Math.floor(elapsed / (12 * 60 * 60 * 1000));
      setQuoteIndex(intervalsOf12H % (quotes.length || 1));
    };
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, []);

  const quote = quotes[quoteIndex] || { id: 1, text: '...' };
  const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const kpis = [
    { label: 'Total Members',    value: stats.totalMembers,   icon: Users,          accent: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/20'   },
    { label: 'Pending Approval', value: stats.pendingMembers, icon: CheckCircle,    accent: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: "Today's Visits",   value: stats.todayVisits,    icon: Calendar,       accent: 'text-emerald-500',bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'New Contacts',     value: stats.newContacts,    icon: MessageSquare,  accent: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20'  },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(({ label, value, icon: Icon, accent, bg }, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-border dark:border-slate-800 shadow-sm flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className={`p-1.5 rounded-md ${bg}`}>
                <Icon className={`w-3.5 h-3.5 ${accent}`} />
              </div>
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
            </div>
            <div>
              <p className={`text-xl font-serif text-forest-deep dark:text-white tabular-nums tracking-tighter ${isLoading ? 'animate-pulse' : ''}`} style={{ fontFamily: '"Libre Baskerville", serif', fontWeight: 400 }}>
                {isLoading ? '–' : value}
              </p>
              <p className="text-[7px] font-bold text-slate-400 dark:text-[#c8a44b]/60 uppercase tracking-[0.2em] mt-0.5 italic" style={{ fontFamily: '"Libre Baskerville", serif' }}>{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Welcome + Quote row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Welcome card */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-border dark:border-white/5 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-700"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full -mr-24 -mt-24 blur-[80px] group-hover:bg-gold/10 transition-all duration-1000" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gold/10 rounded-full border border-gold/10 mb-4">
               <div className="w-1 h-1 rounded-full bg-gold animate-pulse" />
               <span className="text-[8px] font-black text-gold-dark dark:text-gold uppercase tracking-[0.2em]">Operational Pulse</span>
            </div>
            
            <h2 className="text-xl font-serif text-forest-deep dark:text-white mb-1 italic" style={{ fontFamily: '"Libre Baskerville", serif', fontWeight: 400 }}>
              Welcome, <span className="text-gold not-italic">Admin</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-6 max-w-sm leading-relaxed font-light">
              Riyasat Infra real-time ecosystem. Monitor team performance, leads, and assets in one clinical view.
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              <RouterLink
                to="/admin/members"
                className="flex items-center gap-2 px-3 py-1.5 bg-forest-deep text-white text-[9px] font-bold rounded-lg hover:bg-gold hover:text-forest-deep transition-all duration-500 shadow-sm tracking-widest uppercase"
              >
                <Users className="w-3 h-3" />
                Team
              </RouterLink>
              <RouterLink
                to="/admin/meetings"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-deep text-white text-[9px] font-bold rounded-lg hover:bg-gold hover:text-forest-deep transition-all duration-500 shadow-sm tracking-widest uppercase"
              >
                <Calendar className="w-3 h-3" />
                Schedule
              </RouterLink>
              <RouterLink
                to="/admin/visits"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border dark:border-slate-700 text-forest-deep dark:text-slate-300 text-[9px] font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest"
              >
                <MapPin className="w-3 h-3" />
                Visits
              </RouterLink>
            </div>
          </div>
        </motion.div>

        {/* Daily quote */}
        <motion.div
          variants={itemVariants}
          className="bg-[#1B3B2A] rounded-xl p-5 border border-gold/10 text-white relative overflow-hidden flex flex-col justify-between shadow-md"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-gold/10 rounded-full -mr-12 -mt-12 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-gold/70">Daily Suvichar</p>
              <span className="text-[9px] font-bold text-cream/40 uppercase tracking-widest">{todayStr}</span>
            </div>
            <p className="text-sm font-heading leading-relaxed text-cream/90 italic">
              "{quote.text}"
            </p>
          </div>
          <div className="relative z-10 mt-3 flex items-center gap-2">
            <div className="h-px w-6 bg-gold/50" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-gold/50">Sequence #{quote.id}</span>
          </div>
        </motion.div>
      </div>
      {/* System status banner */}
      <motion.div
        variants={itemVariants}
        className="bg-[#1B3B2A] rounded-xl p-4 border border-gold/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-32 h-32 bg-gold/5 rounded-full -mr-10 -mt-10 blur-2xl" />
        <div className="relative z-10">
          <p className="text-xs font-bold text-white mb-0.5">Enterprise SaaS Control</p>
          <p className="text-[10px] text-cream/50">Riyasat Infra — all systems operational</p>
        </div>
        <div className="flex gap-2 relative z-10">
          {[
            { label: 'DB Server', status: 'LIVE' },
            { label: 'SSL',       status: 'SECURE' },
          ].map(({ label, status }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-center">
              <p className="text-xs font-bold text-gold leading-none">{status}</p>
              <p className="text-[9px] text-cream/40 uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Admissions / Visits Feed */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-white/5 shadow-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-border dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <h3 className="text-[10px] font-black text-forest-deep dark:text-white uppercase tracking-[0.2em]">Latest Website Inquiries</h3>
          </div>
          <RouterLink to="/admin/visits" className="text-[9px] font-bold text-gold uppercase tracking-widest hover:underline decoration-gold/30 underline-offset-4">
            View All Logs →
          </RouterLink>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border dark:border-white/5">
                <th className="px-5 py-3 text-[8px] font-black uppercase tracking-widest text-slate-400">Client Entry</th>
                <th className="px-5 py-3 text-[8px] font-black uppercase tracking-widest text-slate-400">Schedule</th>
                <th className="px-5 py-3 text-[8px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-white/5">
              {isLoading ? (
                <tr><td colSpan={3} className="px-5 py-8 text-center text-[10px] text-slate-400 animate-pulse">Synchronizing Global Feed...</td></tr>
              ) : recentVisits.length === 0 ? (
                <tr><td colSpan={3} className="px-5 py-8 text-center text-[10px] text-slate-400 italic font-serif" style={{ fontFamily: '"Libre Baskerville", serif' }}>Wait list is currently empty. Check RLS policies if data exists in Supabase.</td></tr>
              ) : (
                recentVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-[11px] font-bold text-forest-deep dark:text-white uppercase tracking-tight">{visit.full_name}</p>
                      <p className="text-[9px] text-slate-400">{visit.phone}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-[10px] font-medium text-slate-600 dark:text-cream/70">{visit.preferred_date}</p>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                        visit.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {visit.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};
