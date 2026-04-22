import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, MoreVertical, CheckCircle, XCircle, 
  Eye, Download, Shield, Clock, Phone, Mail, MapPin, Calendar,
  ArrowUpRight, ArrowDownRight, UserCheck, UserX, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  ref_id_generated?: string;
  activity_count?: number;
  photo_url?: string;
  address?: string;
  aadhar?: string;
  pan?: string;
}

const MembersAdmin: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (err: unknown) {
      console.error("Error fetching members:", err);
      toast.error("Failed to load members list");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('members')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Member ${newStatus} successfully`);
      fetchMembers();
      if (selectedMember && selectedMember.id === id) {
        setSelectedMember({ ...selectedMember, status: newStatus });
      }
    } catch (err: unknown) {
      toast.error("Status update failed");
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone?.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || m.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const StatsCard = ({ label, value, icon: Icon, color }: { label: string, value: number, icon: React.ElementType, color: string }) => (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-border dark:border-slate-800 shadow-sm flex items-center gap-3">
      <div className={`p-2.5 rounded-lg ${color} shrink-0`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-0.5">{label}</p>
        <p className="text-xl font-bold text-forest-deep dark:text-white tabular-nums">{value}</p>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-heading font-bold text-forest-deep dark:text-white">Member Directory</h2>
          <p className="text-slate-500 mt-0.5 uppercase text-[10px] font-semibold tracking-widest">Management & Compliance</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-lg py-2 pl-9 pr-4 outline-none focus:border-gold transition-all w-full md:w-48 text-xs font-medium"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
              className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-lg py-2 pl-9 pr-8 outline-none focus:border-gold transition-all text-xs font-semibold appearance-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard label="Total Members" value={members.length} icon={Users} color="bg-blue-50 text-blue-600" />
        <StatsCard label="Pending" value={members.filter(m => m.status === 'pending').length} icon={Clock} color="bg-amber-50 text-amber-600" />
        <StatsCard label="Verified" value={members.filter(m => m.status === 'approved').length} icon={CheckCircle} color="bg-emerald-50 text-emerald-600" />
        <StatsCard label="Rejected" value={members.filter(m => m.status === 'rejected').length} icon={XCircle} color="bg-rose-50 text-rose-600" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border dark:border-slate-800 overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-border dark:border-slate-800">
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">Member</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-slate-400 hidden md:table-cell">Contact</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] uppercase tracking-widest text-slate-400">Loading...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-xs text-slate-400 italic">No members found.</td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pista-light/10 border border-gold/10 rounded-lg flex items-center justify-center font-bold text-forest-deep text-xs overflow-hidden shrink-0">
                          {member.photo_url ? (
                            <img src={member.photo_url} alt="" className="w-full h-full object-cover" />
                          ) : member.full_name?.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-forest-deep dark:text-white">{member.full_name}</p>
                          <p className="text-[9px] font-semibold text-gold/80 mt-0.5">{member.ref_id_generated || 'No Ref'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${
                        member.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                        member.status === 'rejected' ? 'bg-rose-50 text-rose-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${
                          member.status === 'approved' ? 'bg-emerald-500' :
                          member.status === 'rejected' ? 'bg-rose-500' :
                          'bg-amber-500 animate-pulse'
                        }`} />
                        {member.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <Phone className="w-2.5 h-2.5" /> {member.phone}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <Mail className="w-2.5 h-2.5" /> {member.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => { setSelectedMember(member); setIsModalOpen(true); }}
                          className="p-1.5 hover:bg-gold/10 rounded-lg text-slate-400 hover:text-gold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {member.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(member.id, 'approved')}
                              className="p-1.5 hover:bg-emerald-50 rounded-lg text-slate-300 hover:text-emerald-500 transition-colors"
                              title="Approve"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(member.id, 'rejected')}
                              className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-300 hover:text-rose-500 transition-colors"
                              title="Reject"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-t-2xl sm:rounded-xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <div className="w-full md:w-1/3 bg-[#0a1f10] p-5 text-white relative">
                 <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gold/10 rounded-xl border border-gold/30 p-0.5 mb-3 flex items-center justify-center overflow-hidden">
                       {selectedMember.photo_url ? (
                         <img src={selectedMember.photo_url} alt="" className="w-full h-full object-cover rounded-lg" />
                       ) : (
                         <Users className="w-7 h-7 text-gold-light" />
                       )}
                    </div>
                    <h3 className="text-sm font-heading font-bold">{selectedMember.full_name}</h3>
                    <p className="text-gold font-bold uppercase text-[9px] tracking-widest mt-1">{selectedMember.role.toUpperCase()}</p>
                    
                    <div className="mt-4 space-y-2 w-full">
                       <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                          <Shield className="w-3.5 h-3.5 text-gold" />
                          <div className="text-left">
                            <p className="text-[9px] font-semibold uppercase tracking-widest text-white/40">Status</p>
                            <p className="text-xs font-bold capitalize">{selectedMember.status}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                          <Calendar className="w-3.5 h-3.5 text-gold" />
                          <div className="text-left">
                            <p className="text-[9px] font-semibold uppercase tracking-widest text-white/40">Joined</p>
                            <p className="text-xs font-bold">{new Date(selectedMember.created_at).toLocaleDateString()}</p>
                          </div>
                       </div>
                    </div>

                    {selectedMember.status === 'pending' && (
                      <div className="mt-4 grid grid-cols-2 gap-2 w-full">
                        <button 
                          onClick={() => handleStatusUpdate(selectedMember.id, 'approved')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2 rounded-lg transition-all"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(selectedMember.id, 'rejected')}
                          className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-2 rounded-lg transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                 </div>
              </div>

              <div className="flex-1 p-5 overflow-y-auto">
                 <div className="flex justify-between items-start mb-4">
                    <h4 className="text-sm font-heading font-bold text-forest-deep dark:text-white">Member Details</h4>
                    <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <XCircle className="w-4 h-4 text-slate-400 hover:text-rose-500" />
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                       <label className="block">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Personal Info</span>
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
                             <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-gold" />
                                <span className="text-sm font-bold text-forest-deep dark:text-white">{selectedMember.phone}</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-gold" />
                                <span className="text-sm font-bold text-forest-deep dark:text-white">{selectedMember.email}</span>
                             </div>
                             <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-gold mt-1" />
                                <span className="text-sm font-bold text-forest-deep dark:text-white leading-relaxed">{selectedMember.address || 'Address not provided'}</span>
                             </div>
                          </div>
                       </label>
                    </div>

                    <div className="space-y-3">
                       <label className="block">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Government ID</span>
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
                             <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500">Aadhar Number</span>
                                <span className="text-sm font-black text-forest-deep dark:text-white">{selectedMember.aadhar || 'Pending'}</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500">PAN Number</span>
                                <span className="text-sm font-black text-forest-deep dark:text-white">{selectedMember.pan || 'Pending'}</span>
                             </div>
                          </div>
                       </label>

                       <div className="bg-gold/10 border-2 border-dashed border-gold/20 p-4 rounded-lg flex items-center gap-3 group cursor-pointer hover:bg-gold/20 transition-all">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gold shrink-0">
                             <Download className="w-4 h-4" />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-forest-deep">Download KYC Docs</p>
                             <p className="text-[9px] text-slate-400">Verification Required</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-4 p-4 bg-pista-light/5 border border-forest-deep/10 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                       <Shield className="w-3.5 h-3.5 text-gold" />
                       <span className="text-xs font-bold text-forest-deep dark:text-white">Compliance Note</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                       All members must undergo mandatory KYC verification. Approval grants access to customer leads and booking systems.
                    </p>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MembersAdmin;
