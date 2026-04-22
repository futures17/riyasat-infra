import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, Users, Plus, Video,
  MapPin, XCircle, Trash2, Send, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'online' | 'offline';
  location?: string;
  assigned_to: 'all' | 'specific';
  status: 'upcoming' | 'completed' | 'cancelled';
  created_at: string;
}

type MeetingFormState = {
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'online' | 'offline';
  location: string;
  assigned_to: 'all' | 'specific';
};

const EMPTY_FORM: MeetingFormState = {
  title: '',
  description: '',
  date: '',
  time: '',
  type: 'online',
  location: '',
  assigned_to: 'all',
};

const MeetingsAdmin: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<MeetingFormState>(EMPTY_FORM);

  useEffect(() => { fetchMeetings(); }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setMeetings(data || []);
    } catch (err: unknown) {
      console.error('Meetings fetch error:', err);
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('meetings')
        .insert([{ ...form, status: 'upcoming' }]);

      if (error) throw error;
      toast.success('Meeting scheduled!');
      setIsModalOpen(false);
      setForm(EMPTY_FORM);
      fetchMeetings();
    } catch (err: unknown) {
      toast.error('Failed to schedule meeting');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('meetings').delete().eq('id', id);
      if (error) throw error;
      toast.success('Meeting removed');
      fetchMeetings();
    } catch (err: unknown) {
      toast.error('Delete failed');
    }
  };

  const field = (key: keyof MeetingFormState) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value })),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-heading font-bold text-forest-deep dark:text-white">Meeting Scheduler</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Coordination &amp; Strategy</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-forest-deep text-white text-xs font-bold rounded-lg hover:bg-forest-light transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Schedule Meeting
        </button>
      </div>

      {/* Meeting cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-44 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
          ))
        ) : meetings.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800">
            <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400 font-medium">No upcoming meetings.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-gold mt-2 text-xs font-bold hover:underline"
            >
              Schedule one now
            </button>
          </div>
        ) : (
          meetings.map((meeting) => (
            <motion.div
              key={meeting.id}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-border dark:border-slate-800 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-lg ${meeting.type === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {meeting.type === 'online'
                    ? <Video className="w-4 h-4" />
                    : <MapPin className="w-4 h-4" />}
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    meeting.status === 'upcoming'   ? 'bg-amber-50 text-amber-600' :
                    meeting.status === 'completed'  ? 'bg-emerald-50 text-emerald-600' :
                    'bg-rose-50 text-rose-500'
                  }`}>
                    {meeting.status}
                  </span>
                  <button
                    onClick={() => handleDelete(meeting.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-forest-deep dark:text-white mb-1 leading-tight">{meeting.title}</h3>
              <p className="text-[10px] text-slate-400 line-clamp-2 mb-3">{meeting.description || 'No agenda provided.'}</p>

              <div className="space-y-1.5 pt-3 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-gold shrink-0" />
                  <span className="text-[10px] font-semibold text-forest-deep dark:text-white">
                    {new Date(meeting.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-gold shrink-0" />
                  <span className="text-[10px] font-semibold text-forest-deep dark:text-white">{meeting.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3 text-gold shrink-0" />
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">{meeting.assigned_to} team</span>
                </div>
              </div>

              <button className="mt-3 w-full py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-forest-deep dark:text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gold/10 transition-colors">
                <Send className="w-3 h-3" /> Send Reminder
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="bg-white dark:bg-slate-900 w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl shadow-2xl relative overflow-hidden p-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-heading font-bold text-forest-deep dark:text-white">
                    Schedule <span className="text-gold">New Meeting</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Enterprise Coordination</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <XCircle className="w-4 h-4 text-slate-400 hover:text-rose-500" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sales Strategy"
                      {...field('title')}
                      className="w-full bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-gold/30 outline-none dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as 'online' | 'offline' }))}
                      className="w-full bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-gold/30 outline-none dark:text-white font-semibold"
                    >
                      <option value="online">Virtual (Video)</option>
                      <option value="offline">In-Person (Office)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Date</label>
                    <input
                      type="date"
                      required
                      {...field('date')}
                      className="w-full bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-gold/30 outline-none dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Time</label>
                    <input
                      type="time"
                      required
                      {...field('time')}
                      className="w-full bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-gold/30 outline-none dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Location / Link</label>
                  <input
                    type="text"
                    placeholder="Meet link or office room"
                    {...field('location')}
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-gold/30 outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Agenda / Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Details for participants..."
                    {...field('description')}
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-gold/30 outline-none dark:text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-forest-deep text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-forest-light transition-colors"
                >
                  <Bell className="w-3.5 h-3.5 text-gold" />
                  Confirm &amp; Notify Team
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MeetingsAdmin;
