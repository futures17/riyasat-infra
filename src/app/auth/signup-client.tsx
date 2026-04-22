import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import { LucidePhone, LucideLock, LucideUserPlus, LucideMail, LucideUser, LucideShieldCheck, LucideEye, LucideEyeOff } from 'lucide-react';

const ClientSignup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Client registration attempt:', formData);
    // TODO: Implement signup logic
  };

  return (
    <AuthLayout 
      title="Create Client Portal" 
      subtitle="Register to track your Green Glades property progress, bookings, and site visits."
    >
      <form onSubmit={handleSubmit}>
        <AuthCard className="flex flex-col gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-forest-deep/60 ml-2 uppercase tracking-widest">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-forest-light group-focus-within:text-gold transition-colors">
                    <LucideUser className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-pista-light/20 border border-gold/10 rounded-2xl py-3.5 pl-12 pr-4 focus:bg-white focus:border-gold outline-none transition-all font-body text-forest-deep text-sm shadow-inner"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-forest-deep/60 ml-2 uppercase tracking-widest">
                  Phone Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-forest-light group-focus-within:text-gold transition-colors">
                    <LucidePhone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    placeholder="+91 00000 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-pista-light/20 border border-gold/10 rounded-2xl py-3.5 pl-12 pr-4 focus:bg-white focus:border-gold outline-none transition-all font-body text-forest-deep text-sm shadow-inner"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-forest-deep/60 ml-2 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-forest-light group-focus-within:text-gold transition-colors">
                  <LucideMail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-pista-light/20 border border-gold/10 rounded-2xl py-3.5 pl-12 pr-4 focus:bg-white focus:border-gold outline-none transition-all font-body text-forest-deep text-sm shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-forest-deep/60 ml-2 uppercase tracking-widest">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-forest-light group-focus-within:text-gold transition-colors">
                  <LucideLock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-pista-light/20 border border-gold/10 rounded-2xl py-3.5 pl-12 pr-12 focus:bg-white focus:border-gold outline-none transition-all font-body text-forest-deep text-sm shadow-inner"
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

            <div className="flex items-start gap-3 mt-4 ml-1">
              <input
                id="terms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-gold/20 text-gold-dark focus:ring-gold outline-none"
                required
              />
              <label htmlFor="terms" className="text-xs text-forest-light leading-relaxed">
                I agree to the <Link to="/terms" className="text-gold-dark hover:underline font-semibold tracking-wide">Privacy Policy</Link> and <Link to="/terms" className="text-gold-dark hover:underline font-semibold tracking-wide">Terms of Service</Link>.
              </label>
            </div>
          </div>

          <button 
            type="submit"
            className="luxury-btn-solid w-full group overflow-hidden relative mt-2"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <LucideUserPlus className="w-5 h-5" />
              Register Account
            </span>
          </button>
          
          <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-forest-light/60 uppercase tracking-widest">
            <LucideShieldCheck className="w-3.5 h-3.5" />
            End-to-End Secure
          </div>
        </AuthCard>
      </form>

      <div className="mt-8 text-center bg-white/40 backdrop-blur-sm py-4 px-6 rounded-2xl border border-white/60">
        <p className="text-sm text-forest-light">
          Already have a client account?{' '}
          <Link 
            to="/auth/login" 
            className="text-gold-dark font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ClientSignup;
