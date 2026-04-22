import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import { LucidePhone, LucideMail, LucideUser, LucideMapPin, LucideIdCard, LucideUpload, LucideArrowRight, LucideCheckCircle, LucideFileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';

const NewMemberSignup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    aadhar: '',
    pan: '',
    referredBy: '',
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      // Auto-compress if it's an image
      if (file.type.startsWith('image/')) {
        try {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          
          toast.info("Compressing image to save storage...", { duration: 2000 });
          const compressedFile = await imageCompression(file, options);
          console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
          console.log(`Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
          setFileToUpload(compressedFile);
        } catch (error) {
          console.error("Compression error:", error);
          setFileToUpload(file); // fallback to original
        }
      } else {
        setFileToUpload(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Real Supabase insert
        const { data, error } = await supabase.from('members').insert([
          {
            email: formData.email.trim(),
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
            role: 'agent',
            status: 'pending'
          }
        ]).select();
        
        if (error) {
          console.error("Supabase insert error:", error);
          throw error;
        }
        
        console.log("Inserted member:", data);

        toast.success("Application submitted successfully!");
        navigate('/member/pending');
      } catch (err: unknown) {
        console.error("Catch error:", err);
        const errorMessage = err instanceof Error ? err.message : (err as { message?: string })?.message || "A network error occurred.";
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <AuthLayout 
      title="Team Onboarding" 
      subtitle="Register as a new team member. Field agents, managers, and reception staff can apply here."
    >
      <div className="flex items-center justify-between mb-8 px-4 w-full max-w-sm mx-auto">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
              step >= s ? 'bg-forest-deep text-gold shadow-lg ring-4 ring-gold/10' : 'bg-pista/30 text-forest-light border border-forest-light/10'
            }`}>
              {step > s ? <LucideCheckCircle className="w-5 h-5" /> : s}
            </div>
            <span className={`text-[10px] uppercase tracking-widest font-bold ${
              step >= s ? 'text-forest-deep' : 'text-forest-light/40'
            }`}>
              {s === 1 ? 'Personal' : 'Documents'}
            </span>
            {s === 1 && <div className={`w-12 h-[2px] mx-2 ${step > 1 ? 'bg-gold' : 'bg-pista/30'}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <AuthCard className="flex flex-col gap-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-forest-deep/60 ml-2 uppercase tracking-widest">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-forest-light group-focus-within:text-gold transition-colors">
                    <LucideUser className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-pista-light/10 border border-gold/10 rounded-2xl py-3 pl-10 pr-4 focus:bg-white focus:border-gold outline-none transition-all font-body text-sm text-forest-deep shadow-inner"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-forest-deep/60 ml-2 uppercase tracking-widest">Phone</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-forest-light group-focus-within:text-gold transition-colors">
                      <LucidePhone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-pista-light/10 border border-gold/10 rounded-2xl py-3 pl-10 pr-4 focus:bg-white focus:border-gold outline-none transition-all font-body text-sm text-forest-deep shadow-inner"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-forest-deep/60 ml-2 uppercase tracking-widest">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-forest-light group-focus-within:text-gold transition-colors">
                      <LucideMail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-pista-light/10 border border-gold/10 rounded-2xl py-3 pl-10 pr-4 focus:bg-white focus:border-gold outline-none transition-all font-body text-sm text-forest-deep shadow-inner"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-forest-deep/60 ml-2 uppercase tracking-widest">Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 pt-3 pointer-events-none text-forest-light group-focus-within:text-gold transition-colors">
                    <LucideMapPin className="w-4 h-4" />
                  </div>
                  <textarea
                    placeholder="Permanent Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-pista-light/10 border border-gold/10 rounded-2xl py-3 pl-10 pr-4 focus:bg-white focus:border-gold outline-none transition-all font-body text-sm text-forest-deep shadow-inner min-h-[80px] resize-none"
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-forest-deep/60 ml-2 uppercase tracking-widest">Aadhar Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-forest-light group-focus-within:text-gold transition-colors">
                      <LucideIdCard className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="0000 0000 0000"
                      value={formData.aadhar}
                      onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                      className="w-full bg-pista-light/10 border border-gold/10 rounded-2xl py-3 pl-10 pr-4 focus:bg-white focus:border-gold outline-none transition-all font-body text-sm text-forest-deep shadow-inner"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-forest-deep/60 ml-2 uppercase tracking-widest">PAN Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-forest-light group-focus-within:text-gold transition-colors">
                      <LucideIdCard className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="ABCDE1234F"
                      value={formData.pan}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                      className="w-full bg-pista-light/10 border border-gold/10 rounded-2xl py-3 pl-10 pr-4 focus:bg-white focus:border-gold outline-none transition-all font-body text-sm text-forest-deep shadow-inner"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-forest-deep/60 ml-2 uppercase tracking-widest">Referred By (Optional)</label>
                <input
                  type="text"
                  placeholder="Employee Name / ID"
                  value={formData.referredBy}
                  onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                  className="w-full bg-pista-light/10 border border-gold/10 rounded-2xl py-3 px-4 focus:bg-white focus:border-gold outline-none transition-all font-body text-sm text-forest-deep shadow-inner"
                />
              </div>

              <label className="p-6 rounded-2xl bg-forest-deep/5 border border-forest-deep/10 border-dashed flex flex-col items-center gap-2 group hover:bg-gold/5 transition-all cursor-pointer relative overflow-hidden">
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,image/*" 
                  onChange={handleFileChange} 
                />
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-forest-light group-hover:text-gold transition-colors">
                  {fileName ? <LucideFileText className="w-5 h-5 text-gold-dark" /> : <LucideUpload className="w-5 h-5" />}
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-forest-deep/60 text-center px-4 w-full truncate">
                  {fileName ? fileName : 'Upload KYC Docs'}
                </span>
                <span className="text-[9px] text-forest-light/40">
                  {fileName ? 'File attached successfully' : 'PDF or Images (Max 5MB)'}
                </span>
              </label>
            </div>
          )}

          <div className="flex gap-3 mt-2">
            {step > 1 && (
              <button 
                type="button"
                onClick={() => setStep(step - 1)}
                className="w-20 rounded-2xl bg-white border border-gold/10 text-forest-deep font-bold hover:bg-gold/5 transition-all"
                disabled={isSubmitting}
              >
                Back
              </button>
            )}
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`luxury-btn-solid flex-1 group overflow-hidden relative ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {step === 1 ? (
                  <>Next Step <LucideArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                ) : (
                  <>{isSubmitting ? 'Submitting...' : 'Submit Registration'}</>
                )}
              </span>
            </button>
          </div>
        </AuthCard>
      </form>

      <div className="mt-8 text-center bg-white/40 backdrop-blur-sm py-4 px-6 rounded-2xl border border-white/60">
        <p className="text-sm text-forest-light">
          Already a member?{' '}
          <Link 
            to="/auth/login" 
            className="text-gold-dark font-bold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default NewMemberSignup;
