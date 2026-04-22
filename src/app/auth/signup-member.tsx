import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import {
  LucideMail, LucideLock, LucideCheckCircle2, LucideUser,
  LucideUserPlus, LucideUserCheck, LucideArrowRight,
  LucideCamera, LucidePhone, LucideLoader2, LucideImage, LucideEye, LucideEyeOff,
  LucideBriefcaseBusiness
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

// ----- Image Compression Utility (Canvas-based, no deps) -----
async function compressImageToWebP(file: File, maxSizeKB = 200, maxDim = 800): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Scale down to maxDim keeping aspect ratio
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas context failed')); return; }
        ctx.drawImage(img, 0, 0, width, height);

        // Try progressively lower quality until under maxSizeKB
        let quality = 0.8;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) { reject(new Error('Compression failed')); return; }
              if (blob.size > maxSizeKB * 1024 && quality > 0.1) {
                quality -= 0.1;
                tryCompress();
              } else {
                const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
                  type: 'image/webp',
                  lastModified: Date.now(),
                });
                resolve(compressed);
              }
            },
            'image/webp',
            quality
          );
        };
        tryCompress();
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

const MemberSignup: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get('mode') === 'existing' ? 'already-member' : 'selection';
  const [view, setView] = useState<'selection' | 'already-member'>(initialView);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Photo state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCompressing(true);
      const originalMB = (file.size / 1024 / 1024).toFixed(1);
      toast.info(`Compressing ${originalMB}MB image...`);

      const compressed = await compressImageToWebP(file, 200, 800);
      const compressedKB = (compressed.size / 1024).toFixed(0);

      setPhotoFile(compressed);
      setPhotoPreview(URL.createObjectURL(compressed));
      toast.success(`Compressed to ${compressedKB}KB (WebP)`);
    } catch (err) {
      toast.error('Image compression failed. Try a different image.');
    } finally {
      setCompressing(false);
    }
  };

  const handleAlreadyMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Create Supabase Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
          }
        }
      });

      if (authError) throw authError;

      // 2. Upload photo to Supabase Storage (if selected)
      let photoUrl: string | null = null;
      if (photoFile) {
        const fileName = `member-photos/${Date.now()}_${photoFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('assets')
          .upload(fileName, photoFile, {
            contentType: 'image/webp',
            upsert: false,
          });

        if (uploadError) {
          console.error('Photo upload error:', uploadError);
          toast.error('Photo upload failed, but account created.');
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('assets')
            .getPublicUrl(fileName);
          photoUrl = publicUrlData?.publicUrl || null;
        }
      }

      // 3. Insert member record as PENDING
      const { error: memberError } = await supabase
        .from('members')
        .insert([{
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: 'agent',
          status: 'pending',
          membership_type: 'existing',
          ...(photoUrl ? { photo_url: photoUrl } : {}),
        }]);

      if (memberError) throw memberError;

      toast.success('Registration request sent! Wait for admin approval.');
      navigate('/member');

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      if (message.includes('fetch') || message.includes('network')) {
        toast.error('Network error — check your internet connection.');
      } else {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AuthLayout
      title={view === 'selection' ? 'Join the Team' : 'Already a Member?'}
      subtitle={
        view === 'selection'
          ? 'Choose your path to become part of the Riyasat legacy.'
          : 'Register for portal access. Your documents are already with the team.'
      }
    >
      <AnimatePresence mode="wait">
        {view === 'selection' ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-4"
          >
            {/* Option 1: Create New Account (full KYC) */}
            <div onClick={() => navigate('/auth/signup-new-member')} className="group cursor-pointer">
              <AuthCard className="border-2 border-transparent hover:border-gold/50 hover:bg-gold/5 transition-all p-6 text-center flex flex-col items-center gap-3 relative overflow-hidden">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                  <LucideUserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-forest-deep mb-1">Create New Account</h3>
                  <p className="text-xs text-forest-light/70 leading-relaxed">
                    New here? Submit your KYC documents and personal details.
                  </p>
                </div>
                <LucideArrowRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </AuthCard>
            </div>

            {/* Option 2: Already a member */}
            <div onClick={() => setView('already-member')} className="group cursor-pointer">
              <AuthCard className="border-2 border-transparent hover:border-gold/50 hover:bg-gold/5 transition-all p-6 text-center flex flex-col items-center gap-3 relative overflow-hidden">
                <div className="w-12 h-12 bg-forest-deep/10 rounded-xl flex items-center justify-center text-forest-deep group-hover:scale-110 transition-transform">
                  <LucideUserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-forest-deep mb-1">Already a Member?</h3>
                  <p className="text-xs text-forest-light/70 leading-relaxed">
                    Your Aadhar &amp; PAN are already submitted physically. Register for portal access.
                  </p>
                </div>
                <LucideArrowRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </AuthCard>
            </div>

            <div onClick={() => navigate('/auth/jobs')} className="group cursor-pointer">
              <AuthCard className="border-2 border-transparent hover:border-gold/50 hover:bg-gold/5 transition-all p-6 text-center flex flex-col items-center gap-3 relative overflow-hidden">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                  <LucideBriefcaseBusiness className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-forest-deep mb-1">Apply for Job</h3>
                  <p className="text-xs text-forest-light/70 leading-relaxed">
                    View openings added by admin and send your application.
                  </p>
                </div>
                <LucideArrowRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </AuthCard>
            </div>
          </motion.div>

        ) : (
          /* Already a Member Registration Form */
          <motion.div
            key="already-member"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <form onSubmit={handleAlreadyMemberSubmit}>
              <AuthCard className="flex flex-col gap-4">
                <div className="space-y-3">

                  {/* Full Name */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Full Name</label>
                    <div className="relative">
                      <LucideUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-light" />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => update('fullName', e.target.value)}
                        className="w-full bg-pista-light/10 border border-gold/10 rounded-xl py-3 pl-10 pr-4 focus:bg-white focus:border-gold outline-none transition-all text-sm text-forest-deep placeholder:text-forest-light/30"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Email Address</label>
                    <div className="relative">
                      <LucideMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-light" />
                      <input
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => update('email', e.target.value)}
                        className="w-full bg-pista-light/10 border border-gold/10 rounded-xl py-3 pl-10 pr-4 focus:bg-white focus:border-gold outline-none transition-all text-sm text-forest-deep placeholder:text-forest-light/30"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Contact Number</label>
                    <div className="relative">
                      <LucidePhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-light" />
                      <input
                        type="tel"
                        placeholder="+91 00000 00000"
                        value={formData.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className="w-full bg-pista-light/10 border border-gold/10 rounded-xl py-3 pl-10 pr-4 focus:bg-white focus:border-gold outline-none transition-all text-sm text-forest-deep placeholder:text-forest-light/30"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Password</label>
                    <div className="relative">
                      <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-light" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={(e) => update('password', e.target.value)}
                        className="w-full bg-pista-light/10 border border-gold/10 rounded-xl py-3 pl-10 pr-12 focus:bg-white focus:border-gold outline-none transition-all text-sm text-forest-deep placeholder:text-forest-light/30"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-forest-light hover:text-gold transition-colors"
                      >
                        {showPassword ? <LucideEyeOff className="w-4 h-4" /> : <LucideEye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Confirm Password</label>
                    <div className="relative">
                      <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-light" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={(e) => update('confirmPassword', e.target.value)}
                        className="w-full bg-pista-light/10 border border-gold/10 rounded-xl py-3 pl-10 pr-12 focus:bg-white focus:border-gold outline-none transition-all text-sm text-forest-deep placeholder:text-forest-light/30"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-forest-light hover:text-gold transition-colors"
                      >
                        {showConfirmPassword ? <LucideEyeOff className="w-4 h-4" /> : <LucideEye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Photo upload — REAL with compression */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Photo (Optional)</label>
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      {photoPreview ? (
                        <div className="w-full h-24 rounded-xl overflow-hidden border-2 border-gold/30 relative">
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute bottom-1 right-1 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                            {photoFile ? `${(photoFile.size / 1024).toFixed(0)}KB` : ''}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-20 bg-pista-light/5 border-2 border-dashed border-gold/20 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-gold/5 transition-all">
                          {compressing ? (
                            <>
                              <LucideLoader2 className="w-5 h-5 text-gold animate-spin" />
                              <span className="text-[10px] text-gold font-semibold">Compressing...</span>
                            </>
                          ) : (
                            <>
                              <LucideCamera className="w-5 h-5 text-forest-light" />
                              <span className="text-[10px] uppercase tracking-widest font-semibold text-forest-light">Tap to Upload</span>
                            </>
                          )}
                        </div>
                      )}
                    </label>
                  </div>

                </div>

                {/* Info note */}
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                  <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                    Your request will be sent to admin for verification. Full dashboard access will be granted after approval.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setView('selection')}
                    className="px-4 py-2.5 bg-white border border-gold/10 rounded-xl font-bold text-sm text-forest-deep hover:bg-gold/5 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-forest-deep text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-forest-light transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <LucideLoader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LucideCheckCircle2 className="w-4 h-4" />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Approval Request'}
                  </button>
                </div>
              </AuthCard>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 text-center bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/60">
        <p className="text-xs text-forest-light">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-gold-dark font-bold hover:underline">
            Login here
          </Link>
          {' · '}
          <Link to="/contact" className="text-forest-light/60 hover:underline">
            Help
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default MemberSignup;
