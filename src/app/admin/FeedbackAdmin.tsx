import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, EyeOff, MessageSquare, Phone, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase, type Feedback } from "@/lib/supabase";

const formatDate = (createdAt: string) =>
  new Date(createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const FeedbackAdmin: React.FC = () => {
  const [feedbackItems, setFeedbackItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setFeedbackItems((data as Feedback[]) || []);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load feedback.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const stats = useMemo(
    () => ({
      total: feedbackItems.length,
      shown: feedbackItems.filter((item) => item.status === "shown").length,
      hidden: feedbackItems.filter((item) => item.status !== "shown").length,
    }),
    [feedbackItems],
  );

  const updateFeedbackStatus = async (id: string, status: "shown" | "hidden") => {
    try {
      const { error } = await supabase
        .from("feedback")
        .update({ status })
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast.success(`Feedback marked as ${status}.`);
      fetchFeedback();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update feedback.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-forest-deep dark:text-white">Feedback</h2>
          <p className="text-slate-500 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">
            Client comments awaiting review visibility
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-sm">
          <MessageSquare className="w-4 h-4 text-gold" />
          <span className="text-sm font-semibold text-forest-deep dark:text-white">{stats.total} total reviews</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Visible reviews", value: stats.shown, icon: CheckCircle },
          { label: "Hidden reviews", value: stats.hidden, icon: EyeOff },
          { label: "Total reviews", value: stats.total, icon: Star },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">{label}</p>
              <Icon className="w-4 h-4 text-gold" />
            </div>
            <p className="mt-3 text-3xl font-serif text-forest-deep dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-border dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-800/50 border-b border-border dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Reviewer</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Rating</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Comment</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Created</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : feedbackItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                    No feedback found yet.
                  </td>
                </tr>
              ) : (
                feedbackItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-forest-deep dark:text-white">{item.user_name}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gold" />
                          {item.phone_e164 || "No phone"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gold">
                        {Array.from({ length: item.rating }).map((_, index) => (
                          <Star key={`${item.id}-${index}`} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-md">
                      {item.comment}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                        item.status === "shown"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {item.status === "shown" ? "Shown" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => updateFeedbackStatus(item.id, "shown")}
                          className="p-2 rounded-xl hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-all"
                          title="Show on website"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFeedbackStatus(item.id, "hidden")}
                          className="p-2 rounded-xl hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all"
                          title="Hide from website"
                        >
                          <EyeOff className="w-5 h-5" />
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
    </div>
  );
};

export default FeedbackAdmin;
