import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, PlusCircle, Calendar, User, ArrowRight, Clock, ShieldAlert, Copy, ExternalLink, Zap, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import quotes from '../../data/quotes.json';
import { motion } from 'framer-motion';
import { Member } from '../../lib/supabase';

export const MemberDashboard = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [memberStatus, setMemberStatus] = useState<'pending' | 'approved' | 'rejected' | 'loading'>('loading');
  const [memberData, setMemberData] = useState<Member | null>(null);

  // Mocking status check for now - in production this would fetch from Supabase based on logged in user
  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Simulate fetching current member
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('members')
            .select('*')
            .eq('email', user.email)
            .single();
          
          if (data) {
            setMemberStatus(data.status);
            setMemberData(data);
          } else {
            // Fallback for demo/dev
            setMemberStatus('pending');
          }
        } else {
          // Default to pending for demo if no user
          setMemberStatus('pending');
        }
      } catch (err) {
        setMemberStatus('pending');
      }
    };

    checkStatus();
  }, []);

  // Quotes Rotation Logic
  useEffect(() => {
    const updateQuote = () => {
      const now = new Date();
      const startDate = new Date("2026-04-03T18:30:00Z").getTime();
      const msSinceStart = Math.max(0, now.getTime() - startDate);
      const currentDay = Math.floor(msSinceStart / 86400000);
      const currentHour = now.getHours();
      const index = Math.floor(currentDay * 2 + (currentHour >= 12 ? 1 : 0)) % quotes.length;
      setQuoteIndex(index);
    };

    updateQuote();
    const interval = setInterval(updateQuote, 60000);
    return () => clearInterval(interval);
  }, []);

  const activeQuote = quotes[quoteIndex] || quotes[0] || { id: 0, text: 'Loading...' };

  const copyReferral = () => {
    const refId = memberData?.ref_id_generated || "RI-PENDING";
    navigator.clipboard.writeText(refId);
    toast.success("Referral ID copied to clipboard!");
  };

  if (memberStatus === 'loading') {
    return (
      <div className="min-h-screen bg-pista-light/10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-forest-deep font-bold animate-pulse">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  // RESTRICTED VIEW FOR PENDING MEMBERS
  if (memberStatus === 'pending') {
    return (
      <div className="min-h-screen bg-pista-light/10 text-forest-deep">
        <header className="h-14 bg-forest-deep text-white flex items-center justify-between px-4 shadow-md">
          <Link to="/" className="font-heading text-base font-bold text-gold tracking-wider">RIYASAT</Link>
          <Link to="/auth/login" className="text-[10px] font-bold uppercase tracking-widest hover:text-gold transition">Logout</Link>
        </header>

        <main className="max-w-lg mx-auto p-4 mt-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gold/10 text-center"
          >
            <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 mx-auto mb-4">
              <Clock className="w-7 h-7 animate-pulse" />
            </div>

            <h1 className="text-lg font-heading font-bold text-forest-deep mb-2">Application <span className="text-gold">Under Review</span></h1>
            <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
              Your membership request is being verified. You'll get full access once approved by admin.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6 text-left">
              {[
                { label: 'KYC', status: 'Verifying', icon: ShieldAlert, color: 'text-amber-500' },
                { label: 'Approval', status: 'Pending', icon: User, color: 'text-slate-400' },
                { label: 'Referral ID', status: 'Awaiting', icon: Zap, color: 'text-slate-400' }
              ].map((step, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <step.icon className={`w-3.5 h-3.5 mb-1.5 ${step.color}`} />
                  <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{step.label}</p>
                  <p className="font-bold text-[10px] text-forest-deep">{step.status}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 border-t border-slate-100 pt-4">
              <Link to="/contact" className="px-4 py-2 bg-forest-deep text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-forest-light transition">
                <ExternalLink className="w-3.5 h-3.5" />
                Contact Admin
              </Link>
              <button 
                onClick={() => window.location.reload()}
                className="text-xs font-bold text-forest-deep hover:text-gold transition px-4 py-2 rounded-lg border border-forest-deep/10"
              >
                Refresh
              </button>
            </div>
          </motion.div>

          <footer className="mt-8 text-center opacity-30">
             <p className="text-[9px] font-bold uppercase tracking-widest">&copy; 2026 Riyasat Infra</p>
          </footer>
        </main>
      </div>
    );
  }

  // FULL DASHBOARD FOR APPROVED MEMBERS
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-foreground">
      {/* Top Navbar */}
      <header className="h-14 bg-forest-deep text-white flex items-center justify-between px-4 shadow-md">
        <Link to="/" className="font-heading text-base font-bold tracking-wider text-gold">RIYASAT</Link>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-gold">{memberData?.role || 'AGENT'}</span>
          </div>
          <Link to="/auth/login" className="text-[10px] font-bold uppercase tracking-widest hover:text-gold transition">Logout</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-3 md:p-6 space-y-4">
        
        {/* Welcome & Referral */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-border relative overflow-hidden">
            <h2 className="text-lg font-heading font-bold text-forest-deep mb-1">Welcome, {memberData?.full_name?.split(' ')[0] || 'Member'}</h2>
            <p className="text-xs text-slate-500 mb-4">Your daily operations dashboard.</p>
            
            <div className="flex flex-wrap gap-2">
              <Link to="/member/new-visit" className="px-3 py-2 bg-forest-deep text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-forest-light transition">
                <PlusCircle className="w-3.5 h-3.5" />
                New Visit
              </Link>
              
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                <div>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 block leading-none">Referral</span>
                  <span className="text-xs font-bold text-forest-deep">{memberData?.ref_id_generated || 'RI-XXXX'}</span>
                </div>
                <button onClick={copyReferral} className="p-1 hover:bg-white rounded transition-colors text-gold">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#1B3B2A] rounded-xl p-5 text-white flex flex-col justify-between relative overflow-hidden">
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gold/70 mb-2">Daily Suvichar</span>
            <p className="text-sm font-heading leading-relaxed italic text-cream/90">
               "{activeQuote?.text}"
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-px w-6 bg-gold/50" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-gold/50">#{quoteIndex + 1}</span>
            </div>
          </div>
        </div>

        {/* Tasks & Visits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-heading font-bold text-forest-deep">Ongoing Tasks</h3>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">2 Active</span>
            </div>
            <div className="space-y-2">
              {[
                { title: 'Client Follow-up', desc: 'Reach out to Rahul for Plot 128', icon: User, color: 'text-blue-500', bg: 'bg-blue-50' },
                { title: 'Documentation', desc: 'Upload Aadhar for Booking #452', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' }
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-all">
                  <div className={`p-2 rounded-lg ${task.bg} ${task.color} shrink-0`}>
                    <task.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-forest-deep">{task.title}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{task.desc}</p>
                  </div>
                  <button className="text-slate-200 hover:text-emerald-500 transition-colors shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-heading font-bold text-forest-deep">Recent Visits</h3>
              <Link to="/member/visits" className="text-[9px] font-bold uppercase tracking-wider text-gold hover:underline">View All</Link>
            </div>
            <div className="space-y-2">
              {[
                { client: 'Sameer Khan', time: 'Yesterday', status: 'Approved', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { client: 'Anjali Sharma', time: 'Today', status: 'Pending', color: 'text-amber-500', bg: 'bg-amber-50' }
              ].map((visit, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400 text-[10px] shrink-0">
                      {visit.client.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-forest-deep">{visit.client}</h4>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider">{visit.time}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${visit.bg} ${visit.color}`}>
                    {visit.status}
                  </span>
                </div>
              ))}
              
              <Link to="/member/visits" className="flex items-center justify-center gap-2 mt-2 p-2.5 rounded-lg bg-slate-50 text-[10px] font-bold text-forest-deep hover:bg-gold/10 transition-all">
                Full Visit History
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;

