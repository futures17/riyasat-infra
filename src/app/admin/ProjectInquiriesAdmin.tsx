import React, { useEffect, useMemo, useState } from "react";
import { BarChart3, Building2, Home, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase, type ContactRequest } from "@/lib/supabase";

const formatDate = (createdAt: string) =>
  new Date(createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const indicatorClass = (sourcePage?: string | null) =>
  sourcePage === "project"
    ? "bg-gold/10 text-gold-dark border-gold/20"
    : "bg-emerald-50 text-emerald-700 border-emerald-100";

const indicatorText = (sourcePage?: string | null) =>
  sourcePage === "project" ? "From Project" : "From Home";

const ProjectInquiriesAdmin: React.FC = () => {
  const [inquiries, setInquiries] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("contacts")
          .select("*")
          .in("source_page", ["home", "project"])
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setInquiries((data as ContactRequest[]) || []);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load project inquiries.";
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const stats = useMemo(
    () => ({
      total: inquiries.length,
      home: inquiries.filter((item) => item.source_page === "home").length,
      project: inquiries.filter((item) => item.source_page === "project").length,
    }),
    [inquiries],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-forest-deep dark:text-white">Project Inquiry Analytics</h2>
          <p className="text-slate-500 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">
            Home and project Get in Touch tracking
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-sm">
          <BarChart3 className="w-4 h-4 text-gold" />
          <span className="text-sm font-semibold text-forest-deep dark:text-white">{stats.total} tracked inquiries</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total tracked", value: stats.total, icon: BarChart3 },
          { label: "From home", value: stats.home, icon: Home },
          { label: "From project", value: stats.project, icon: Building2 },
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
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Message</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Indicator</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                    No home or project inquiries found yet.
                  </td>
                </tr>
              ) : (
                inquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-forest-deep dark:text-white">{item.name}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gold" />
                          {item.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-md">
                      {item.message || "No message provided"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${indicatorClass(item.source_page)}`}>
                        {indicatorText(item.source_page)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                      {formatDate(item.created_at)}
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

export default ProjectInquiriesAdmin;
