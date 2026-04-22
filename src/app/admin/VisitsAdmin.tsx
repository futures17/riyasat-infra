import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  History,
  MoreVertical,
  Navigation,
  Search,
  Tag,
  Trash2,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase, type Visit } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ADMIN_CLEAR_PASSWORD = "Riyasat&Infra@20-26";

const buildVisitPayload = (status: Visit["status"]) => ({
  status,
  visit_status: status === "completed" ? "completed" : status === "cancelled" ? "cancelled" : "scheduled",
  updated_at: new Date().toISOString(),
});

const VisitsAdmin: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isClearing, setIsClearing] = useState(false);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("visits")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setVisits((data as Visit[]) || []);
    } catch (err: unknown) {
      const errorObject = err as Error;
      console.error("Error fetching visits:", errorObject);
      toast.error("Failed to load site visits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const updateVisitStatus = async (id: string, newStatus: Visit["status"]) => {
    try {
      const { error } = await supabase
        .from("visits")
        .update(buildVisitPayload(newStatus))
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast.success(`Visit moved to ${newStatus}.`);
      fetchVisits();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Update failed.";
      toast.error(errorMsg);
    }
  };

  const softDeleteVisit = async (id: string) => {
    try {
      const { error } = await supabase
        .from("visits")
        .update({
          is_deleted: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast.success("Visit deleted successfully.");
      fetchVisits();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Delete failed.";
      toast.error(errorMsg);
    }
  };

  const filteredVisits = useMemo(
    () =>
      visits.filter((visit) => {
        const searchValue = searchTerm.toLowerCase();
        const matchesSearch =
          visit.full_name?.toLowerCase().includes(searchValue) ||
          visit.phone?.includes(searchTerm) ||
          visit.ref_id?.toLowerCase().includes(searchValue);

        const matchesFilter = filterStatus === "all" || visit.status === filterStatus;
        return matchesSearch && matchesFilter;
      }),
    [filterStatus, searchTerm, visits],
  );

  const handleClearAllVisits = async () => {
    if (adminPassword !== ADMIN_CLEAR_PASSWORD) {
      toast.error("Admin password incorrect.");
      return;
    }

    try {
      setIsClearing(true);
      const { error } = await supabase
        .from("visits")
        .update({
          is_deleted: true,
          updated_at: new Date().toISOString(),
        })
        .eq("is_deleted", false);

      if (error) {
        throw error;
      }

      toast.success("All site visits cleared.");
      setAdminPassword("");
      setShowClearDialog(false);
      fetchVisits();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to clear visits.";
      toast.error(errorMsg);
    } finally {
      setIsClearing(false);
    }
  };

  const renderStatusBadge = (status: Visit["status"]) => {
    const statusClass =
      status === "completed"
        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
        : status === "cancelled"
          ? "bg-rose-50 text-rose-600 border-rose-100"
          : status === "postponed"
            ? "bg-blue-50 text-blue-600 border-blue-100"
            : "bg-amber-50 text-amber-600 border-amber-100";

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusClass}`}>
        {status}
      </span>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-forest-deep dark:text-white">Site Visit Logs</h2>
          <p className="text-slate-500 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">
            Pending, postponed, cancelled and completed flow
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-gold transition-colors" />
            <input
              type="text"
              placeholder="Search by client or referral ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl py-2.5 pl-12 pr-6 outline-none focus:border-gold transition-all w-full md:w-80 text-sm font-medium"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl py-2.5 px-6 outline-none focus:border-gold transition-all text-sm font-bold appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="postponed">Postponed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            type="button"
            onClick={() => setShowClearDialog(true)}
            className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-white dark:bg-slate-900 text-xs font-bold uppercase tracking-[0.2em] hover:bg-rose-50 transition-all"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-border dark:border-slate-800 overflow-hidden relative">
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-border dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Client Info</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Scheduled For</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Referral Attribution</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 italic font-medium">
                    No site visits recorded yet.
                  </td>
                </tr>
              ) : (
                filteredVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-pista-light/10 rounded-lg flex items-center justify-center font-bold text-forest-deep shadow-inner">
                          {visit.full_name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-forest-deep dark:text-white uppercase tracking-tight text-sm">{visit.full_name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{visit.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-forest-deep dark:text-cream">
                          <Calendar className="w-3.5 h-3.5 text-gold" /> {visit.preferred_date}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <Clock className="w-3.5 h-3.5" /> {visit.visit_status || "scheduled"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {visit.ref_id ? (
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gold" />
                          <span className="text-[10px] font-black text-forest-deep dark:text-white uppercase tracking-wider bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                            {visit.ref_id}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-300 uppercase tracking-widest italic">Direct Booking</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{renderStatusBadge(visit.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {visit.status !== "completed" && (
                          <button
                            type="button"
                            onClick={() => updateVisitStatus(visit.id, "completed")}
                            className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        {visit.status !== "postponed" && visit.status !== "completed" && visit.status !== "cancelled" && (
                          <button
                            type="button"
                            onClick={() => updateVisitStatus(visit.id, "postponed")}
                            className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
                            title="Mark as Postponed"
                          >
                            <History className="w-5 h-5" />
                          </button>
                        )}
                        {visit.status === "postponed" && (
                          <button
                            type="button"
                            onClick={() => updateVisitStatus(visit.id, "pending")}
                            className="p-2 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-xl transition-all"
                            title="Move back to Pending"
                          >
                            <Navigation className="w-5 h-5" />
                          </button>
                        )}
                        {visit.status !== "cancelled" && (
                          <button
                            type="button"
                            onClick={() => updateVisitStatus(visit.id, "cancelled")}
                            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all"
                            title="Cancel Visit"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => softDeleteVisit(visit.id)}
                          className="p-2 hover:bg-slate-100 text-slate-300 hover:text-slate-600 rounded-xl transition-all"
                          title="Delete Visit"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          className="p-2 hover:bg-slate-100 text-slate-200 hover:text-slate-500 rounded-lg transition-all"
                          title="More Info"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="sm:max-w-md border-gold/30 bg-background/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-forest-deep font-heading text-2xl">Clear All Site Visits</DialogTitle>
            <DialogDescription className="font-body text-muted-foreground">
              Enter admin password to clear all current visit records from the admin view.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-4">
            <label htmlFor="visit-clear-password" className="text-xs uppercase tracking-wider font-bold text-forest-deep">
              Admin Password
            </label>
            <input
              id="visit-clear-password"
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gold/30 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 font-body text-sm"
              placeholder="Enter admin password"
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={handleClearAllVisits}
              disabled={isClearing}
              className="luxury-btn-solid w-full my-2 disabled:opacity-50"
            >
              {isClearing ? "Clearing..." : "Confirm Clear All"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default VisitsAdmin;
