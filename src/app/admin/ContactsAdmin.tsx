import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, LayoutList, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase, type ContactRequest } from "@/lib/supabase";

const SOURCE_LABELS: Record<string, string> = {
  home: "From Home",
  project: "From Project",
  contact: "From Contact",
};

const SOURCE_COLORS: Record<string, string> = {
  home: "bg-emerald-50 text-emerald-700 border-emerald-100",
  project: "bg-gold/10 text-gold-dark border-gold/20",
  contact: "bg-blue-50 text-blue-700 border-blue-100",
};

const formatSource = (sourcePage?: string | null) => SOURCE_LABELS[sourcePage ?? ""] || "Unknown";

const formatSourceClass = (sourcePage?: string | null) =>
  SOURCE_COLORS[sourcePage ?? ""] || "bg-slate-100 text-slate-600 border-slate-200";

const formatDate = (createdAt: string) =>
  new Date(createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const ContactsAdmin: React.FC = () => {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("contacts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setContacts((data as ContactRequest[]) || []);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load contacts.";
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const sourceCounts = useMemo(
    () => ({
      home: contacts.filter((contact) => contact.source_page === "home").length,
      project: contacts.filter((contact) => contact.source_page === "project").length,
      contact: contacts.filter((contact) => contact.source_page === "contact").length,
    }),
    [contacts],
  );

  const projectInquiries = useMemo(
    () => contacts.filter((contact) => contact.source_page === "project"),
    [contacts],
  );

  const renderRows = (rows: ContactRequest[], emptyMessage: string) => {
    if (loading) {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-12 text-center">
            <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          </td>
        </tr>
      );
    }

    if (rows.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
            {emptyMessage}
          </td>
        </tr>
      );
    }

    return rows.map((contact) => (
      <tr key={contact.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
        <td className="px-6 py-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-forest-deep dark:text-white">{contact.name}</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gold" />
              {contact.phone}
            </p>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-md">
          {contact.message || "No message provided"}
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${formatSourceClass(contact.source_page)}`}>
            {formatSource(contact.source_page)}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-slate-500">{contact.source_page || "unknown"}</td>
        <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{formatDate(contact.created_at)}</td>
      </tr>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-forest-deep dark:text-white">Contacts</h2>
          <p className="text-slate-500 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">
            Website inquiries with source tracking
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-sm">
          <MessageSquare className="w-4 h-4 text-gold" />
          <span className="text-sm font-semibold text-forest-deep dark:text-white">{contacts.length} total inquiries</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Home inquiries", value: sourceCounts.home, icon: LayoutList },
          { label: "Project inquiries", value: sourceCounts.project, icon: MessageSquare },
          { label: "Contact page inquiries", value: sourceCounts.contact, icon: CalendarDays },
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
        <div className="px-6 py-4 border-b border-border dark:border-slate-800">
          <h3 className="text-lg font-heading font-bold text-forest-deep dark:text-white">All Inquiries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-800/50 border-b border-border dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Message</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Indicator</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Source</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-800">
              {renderRows(contacts, "No contact inquiries found yet.")}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-border dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-border dark:border-slate-800">
          <h3 className="text-lg font-heading font-bold text-forest-deep dark:text-white">Project Inquiries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-800/50 border-b border-border dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Message</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Indicator</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Source</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-800">
              {renderRows(projectInquiries, "No project inquiries found yet.")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactsAdmin;
