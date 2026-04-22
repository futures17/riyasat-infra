import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

const AdminBookVisit = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    preferred_date: '',
    preferred_time: 'Morning (10 AM - 1 PM)',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone || !formData.preferred_date) {
      toast.error("Please fill in required fields: Name, Phone, and Date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('visits').insert([{
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email,
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        message: formData.message,
        status: 'confirmed' // Admins book directly as confirmed
      }]);

      if (error) throw error;

      toast.success("Site visit booked successfully!");
      setFormData({
        full_name: '',
        phone: '',
        email: '',
        preferred_date: '',
        preferred_time: 'Morning (10 AM - 1 PM)',
        message: ''
      });
    } catch (err) {
      const errorObject = err as Error;
      console.error("Booking failed:", errorObject);
      toast.error(errorObject.message || "Failed to book visit");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl"
    >
      <div className="mb-6">
        <h2 className="text-xl font-heading font-bold text-forest-deep dark:text-white">Internal Booking Engine</h2>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1">Manual Client Entry & Direct Scheduling</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-white/5 shadow-md overflow-hidden">
        <div className="bg-forest-deep/5 dark:bg-white/5 px-6 py-3 border-b border-border dark:border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-bold text-forest-deep dark:text-gold uppercase tracking-widest">New Visit Entry</span>
          <div className="flex items-center gap-1.5 text-[9px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" /> DIRECT CONFIRMATION
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Client Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name *</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-gold transition-colors" />
                  <input
                    type="text"
                    placeholder="Enter client name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-border dark:border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs focus:border-gold outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Phone Number *</label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-gold transition-colors" />
                  <input
                    type="tel"
                    placeholder="+91"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-border dark:border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs focus:border-gold outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-gold transition-colors" />
                  <input
                    type="email"
                    placeholder="client@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-border dark:border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Schedule Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Visit Date *</label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold group-focus-within:scale-110 transition-transform" />
                  <input
                    type="date"
                    value={formData.preferred_date}
                    onChange={(e) => setFormData({...formData, preferred_date: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-border dark:border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs focus:border-gold outline-none transition-all dark:color-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Time Preferred</label>
                <div className="relative group">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold" />
                  <select
                    value={formData.preferred_time}
                    onChange={(e) => setFormData({...formData, preferred_time: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-border dark:border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs focus:border-gold outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option>Morning (10 AM - 1 PM)</option>
                    <option>Afternoon (1 PM - 4 PM)</option>
                    <option>Evening (4 PM - 7 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Notes / Message</label>
                <textarea
                  placeholder="Special requests or client interest details..."
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-border dark:border-slate-700 rounded-lg py-2 px-4 text-xs focus:border-gold outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border dark:border-white/5 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-3 px-8 py-2.5 bg-forest-deep text-white text-[10px] font-bold rounded-lg hover:bg-gold hover:text-forest-deep transition-all duration-500 shadow-md shadow-forest-deep/20 tracking-widest uppercase disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {isSubmitting ? 'Processing...' : 'Confirm site visit'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminBookVisit;
