import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  FileText,
  Loader2,
  Mail,
  Phone,
  Upload,
  User,
} from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import { supabase, type Job } from "@/lib/supabase";

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    gender: "",
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        const safeJobs = (data as Job[]) || [];
        setJobs(safeJobs);

        if (safeJobs[0]?.id) {
          setSelectedJobId((current) => current || safeJobs[0].id);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load jobs.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) || null,
    [jobs, selectedJobId],
  );

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setResumeFile(file);
    setResumeName(file?.name || "");
  };

  const handleApply = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting || !selectedJob) {
      return;
    }

    try {
      setIsSubmitting(true);

      let resumeUrl: string | null = null;

      if (resumeFile) {
        const filePath = `job-resumes/${Date.now()}_${resumeFile.name.replace(/\s+/g, "_")}`;
        const { error: uploadError } = await supabase.storage
          .from("assets")
          .upload(filePath, resumeFile, { upsert: false });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("assets")
          .getPublicUrl(filePath);

        resumeUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("job_applications").insert([
        {
          job_id: selectedJob.id,
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim().toLowerCase(),
          gender: formData.gender || null,
          resume_url: resumeUrl,
          status: "new",
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success("Job application submitted successfully.");
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        gender: "",
      });
      setResumeFile(null);
      setResumeName("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit application.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Apply for Job"
      subtitle="Browse openings added by admin and submit your application."
    >
      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-5">
        <AuthCard className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-heading font-bold text-forest-deep">Open Positions</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1">Live careers feed</p>
            </div>
            <BriefcaseBusiness className="w-5 h-5 text-gold" />
          </div>

          {loading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-gold" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gold/20 p-6 text-center">
              <p className="text-sm font-semibold text-forest-deep">No jobs available right now.</p>
              <p className="text-xs text-slate-500 mt-2">Please check again later.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => {
                const isSelected = selectedJobId === job.id;
                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => setSelectedJobId(job.id)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? "border-gold/40 bg-gold/5"
                        : "border-gold/10 bg-white/60 hover:border-gold/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-forest-deep">{job.title}</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1">
                          {job.category || "General"}
                        </p>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gold-dark">
                        Apply
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 line-clamp-3">
                      {job.description || "Details will be shared by the hiring team."}
                    </p>
                    {job.requirements && (
                      <p className="text-[11px] text-forest-deep/80 mt-3">
                        <span className="font-bold">Requirements:</span> {job.requirements}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </AuthCard>

        <AuthCard className="space-y-5">
          <div>
            <h2 className="text-base font-heading font-bold text-forest-deep">Application Form</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1">
              {selectedJob ? selectedJob.title : "Select a job first"}
            </p>
          </div>

          <form onSubmit={handleApply} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-light" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(event) => setFormData((current) => ({ ...current, fullName: event.target.value }))}
                  className="w-full bg-pista-light/10 border border-gold/10 rounded-xl py-3 pl-10 pr-4 focus:bg-white focus:border-gold outline-none transition-all text-sm text-forest-deep"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-light" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
                  className="w-full bg-pista-light/10 border border-gold/10 rounded-xl py-3 pl-10 pr-4 focus:bg-white focus:border-gold outline-none transition-all text-sm text-forest-deep"
                  placeholder="+91 00000 00000"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-light" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  className="w-full bg-pista-light/10 border border-gold/10 rounded-xl py-3 pl-10 pr-4 focus:bg-white focus:border-gold outline-none transition-all text-sm text-forest-deep"
                  placeholder="name@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Gender</label>
              <select
                value={formData.gender}
                onChange={(event) => setFormData((current) => ({ ...current, gender: event.target.value }))}
                className="w-full bg-pista-light/10 border border-gold/10 rounded-xl py-3 px-4 focus:bg-white focus:border-gold outline-none transition-all text-sm text-forest-deep"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Resume</label>
              <label className="flex items-center gap-3 rounded-2xl border border-dashed border-gold/20 bg-pista-light/5 px-4 py-4 cursor-pointer hover:bg-gold/5 transition-all">
                <Upload className="w-4 h-4 text-gold" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-forest-deep truncate">
                    {resumeName || "Upload resume (optional)"}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">PDF, DOC, image</p>
                </div>
                <input type="file" className="hidden" onChange={handleResumeChange} />
              </label>
            </div>

            {selectedJob?.requirements && (
              <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Requirements</p>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">{selectedJob.requirements}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !selectedJob}
              className="luxury-btn-solid w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Apply Now"}
            </button>
          </form>

          <div className="text-center text-xs text-forest-light">
            <Link to="/auth/login" className="text-gold-dark font-bold hover:underline">
              Back to login
            </Link>
          </div>
        </AuthCard>
      </div>
    </AuthLayout>
  );
};

export default JobsPage;
