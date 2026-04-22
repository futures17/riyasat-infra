import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import { LucidePhone, LucideLock, LucideArrowRight, LucideMail, LucideUserPlus, LucideUserCheck, LucideEye, LucideEyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getPortalAccess } from '@/lib/portalAuth';
import { isLegacyAdminCredential, startLocalAdminSession } from '@/lib/adminSession';
import { toast } from 'sonner';


const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const email = identifier.trim().toLowerCase();
    const pwd = password.trim();

    if (!email || !pwd) return;

    try {
      if (isLegacyAdminCredential(email, pwd)) {
        startLocalAdminSession();
        toast.success("Welcome to Admin Portal");
        navigate('/admin');
        return;
      }

      let signInResult = await supabase.auth.signInWithPassword({
        email,
        password: pwd,
      });

      if (signInResult.error) {
        toast.error(signInResult.error.message || "Invalid credentials. Please try again.");
        return;
      }

      if (signInResult.error || !signInResult.data.user) {
        toast.error(signInResult.error?.message || "Login failed. Please try again.");
        return;
      }

      const access = await getPortalAccess(signInResult.data.user);

      if (access.isAdmin) {
        toast.success("Welcome to Admin Portal");
        navigate('/admin');
        return;
      }

      if (access.status === 'pending') {
        toast.success("Your approval request is still pending.");
        navigate('/member/pending');
        return;
      }

      if (access.isApproved) {
        toast.success("Login successful.");
        navigate('/member/dashboard');
        return;
      }

      await supabase.auth.signOut();
      toast.error("Your account does not have portal access yet.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Server error. Please try again later.";
      toast.error(message);
    }
  };

  return (
    <AuthLayout 
      title="Secure Login" 
      subtitle="Access your Green Glades dashboard. Please select your role and enter credentials."
    >
      <form onSubmit={handleSubmit}>

        <AuthCard className="flex flex-col gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-forest-deep/60 ml-2 uppercase tracking-widest">
                Phone or Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-forest-light group-focus-within:text-gold transition-colors">
                  {identifier.includes('@') ? <LucideMail className="w-5 h-5" /> : <LucidePhone className="w-5 h-5" />}
                </div>
                <input
                  type="text"
                  placeholder="Enter registered contact"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-pista-light/20 border border-gold/10 rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:border-gold outline-none transition-all font-body text-forest-deep placeholder:text-forest-light/30 shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-xs font-semibold text-forest-deep/60 uppercase tracking-widest">
                  Password
                </label>
                <Link 
                  to="/auth/forgot-password" 
                  className="text-[10px] text-gold-dark hover:underline font-semibold uppercase tracking-wider"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-forest-light group-focus-within:text-gold transition-colors">
                  <LucideLock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-pista-light/20 border border-gold/10 rounded-2xl py-4 pl-12 pr-12 focus:bg-white focus:border-gold outline-none transition-all font-body text-forest-deep placeholder:text-forest-light/30 shadow-inner"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-forest-light hover:text-gold transition-colors"
                >
                  {showPassword ? <LucideEyeOff className="w-5 h-5" /> : <LucideEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="luxury-btn-solid w-full group overflow-hidden relative mt-2"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Authorize Access
              <LucideArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </AuthCard>
      </form>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-[1px] flex-1 bg-gold/10" />
          <span className="text-[10px] text-forest-light/40 uppercase tracking-widest">Don't have an account?</span>
          <div className="h-[1px] flex-1 bg-gold/10" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/auth/signup-new-member"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/60 border border-gold/10 hover:bg-gold/5 hover:border-gold/30 transition-all text-center"
          >
            <LucideUserPlus className="w-5 h-5 text-gold" />
            <span className="text-xs font-bold text-forest-deep">Create New Account</span>
          </Link>
          <Link
            to="/auth/signup-member?mode=existing"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/60 border border-gold/10 hover:bg-gold/5 hover:border-gold/30 transition-all text-center"
          >
            <LucideUserCheck className="w-5 h-5 text-forest-deep" />
            <span className="text-xs font-bold text-forest-deep">Already a Member?</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
