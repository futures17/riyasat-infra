import React, { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, FileUser, PlusCircle, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase, type Job, type JobApplication } from "@/lib/supabase";

const formatDate = (createdAt: string) =>
  new Date(createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const CareersAdmin: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    category: "",
    requirements: "",
    imageUrl: "",
  });

  const fetchCareerData = async () => {
    try {
      setLoading(true);

      const [{ data: jobsData, error: jobsError }, { data: applicationsData, error: applicationsError }] =
        await Promise.all([
          supabase.from("jobs").select("*").order("created_at", { ascending: false }),
          supabase
            .from("job_applications")
            .select("*, jobs(title)")
            .order("created_at", { ascending: false }),
        ]);

      if (jobsError) {
        throw jobsError;
      }

      if (applicationsError) {
        throw applicationsError;
      }

      setJobs((jobsData as Job[]) || []);
      setApplications((applicationsData as JobApplication[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load careers data.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareerData();
  }, []);

  const stats = useMemo(
    () => ({
      jobs: jobs.length,
      applications: applications.length,
      fresh: applications.filter((item) => item.status === "new" || !item.status).length,
    }),
    [applications, jobs.length],
  );

  const createJob = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.from("jobs").insert([
        {
          title: jobForm.title.trim(),
          description: jobForm.description.trim() || null,
          category: jobForm.category.trim() || null,
          requirements: jobForm.requirements.trim() || null,
          image_url: jobForm.imageUrl.trim() || null,
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success("Job added successfully.");
      setJobForm({
        title: "",
        description: "",
        category: "",
        requirements: "",
        imageUrl: "",
      });
      fetchCareerData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add job.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateApplicationStatus = async (
    id: string,
    status: "reviewed" | "rejected" | "selected",
  ) => {
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status })
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast.success(`Application marked as ${status}.`);
      fetchCareerData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update application.";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-forest-deep dark:text-white">Careers</h2>
          <p className="text-slate-500 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">
            Add jobs and review candidates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Open jobs", value: stats.jobs, icon: BriefcaseBusiness },
          { label: "Applications", value: stats.applications, icon: Users },
          { label: "New candidates", value: stats.fresh, icon: FileUser },
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

      <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircle className="w-4 h-4 text-gold" />
            <h3 className="text-lg font-heading font-bold text-forest-deep dark:text-white">Add Job</h3>
          </div>

          <form onSubmit={createJob} className="space-y-4">
            <input
              type="text"
              placeholder="Job title"
              value={jobForm.title}
              onChange={(event) => setJobForm((current) => ({ ...current, title: event.target.value }))}
              className="w-full rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm outline-none focus:border-gold"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={jobForm.category}
              onChange={(event) => setJobForm((current) => ({ ...current, category: event.target.value }))}
              className="w-full rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm outline-none focus:border-gold"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={jobForm.imageUrl}
              onChange={(event) => setJobForm((current) => ({ ...current, imageUrl: event.target.value }))}
              className="w-full rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm outline-none focus:border-gold"
            />
            <textarea
              placeholder="Description"
              value={jobForm.description}
              onChange={(event) => setJobForm((current) => ({ ...current, description: event.target.value }))}
              className="w-full min-h-[120px] rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm outline-none focus:border-gold resize-none"
            />
            <textarea
              placeholder="Requirements"
              value={jobForm.requirements}
              onChange={(event) => setJobForm((current) => ({ ...current, requirements: event.target.value }))}
              className="w-full min-h-[120px] rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm outline-none focus:border-gold resize-none"
            />
            <button type="submit" disabled={isSubmitting} className="luxury-btn-solid w-full disabled:opacity-60">
              {isSubmitting ? "Saving..." : "Add Job"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border dark:border-slate-800">
              <h3 className="text-lg font-heading font-bold text-forest-deep dark:text-white">View Jobs</h3>
            </div>
            <div className="divide-y divide-border dark:divide-slate-800">
              {loading ? (
                <div className="px-6 py-12 text-center text-slate-400">Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <div className="px-6 py-12 text-center text-slate-400 italic">No jobs added yet.</div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-forest-deep dark:text-white">{job.title}</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1">
                          {job.category || "General"}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(job.created_at)}</span>
                    </div>
                    {job.description && (
                      <p className="text-sm text-slate-500 mt-3">{job.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border dark:border-slate-800">
              <h3 className="text-lg font-heading font-bold text-forest-deep dark:text-white">View Applications</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 dark:bg-slate-800/50 border-b border-border dark:border-slate-800">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Candidate</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Job</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Resume</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading applications...</td>
                    </tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No applications yet.</td>
                    </tr>
                  ) : (
                    applications.map((application) => (
                      <tr key={application.id}>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-bold text-forest-deep dark:text-white">{application.full_name}</p>
                            <p className="text-[11px] text-slate-500 mt-1">{application.phone} • {application.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {application.jobs?.title || "Job removed"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {application.resume_url ? (
                            <a
                              href={application.resume_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gold-dark font-semibold hover:underline"
                            >
                              Open Resume
                            </a>
                          ) : (
                            <span className="text-slate-400">Not uploaded</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-600 border-slate-200">
                            {application.status || "new"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => updateApplicationStatus(application.id, "reviewed")}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100 text-blue-700 hover:bg-blue-50 transition-all"
                            >
                              Review
                            </button>
                            <button
                              type="button"
                              onClick={() => updateApplicationStatus(application.id, "selected")}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100 text-emerald-700 hover:bg-emerald-50 transition-all"
                            >
                              Select
                            </button>
                            <button
                              type="button"
                              onClick={() => updateApplicationStatus(application.id, "rejected")}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100 text-rose-700 hover:bg-rose-50 transition-all"
                            >
                              Reject
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
      </div>
    </div>
  );
};

export default CareersAdmin;
