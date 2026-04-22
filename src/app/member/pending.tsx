import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import { LucideClock, LucideArrowLeft } from 'lucide-react';

const PendingPage: React.FC = () => {
  return (
    <AuthLayout 
      title="Approval Pending" 
      subtitle="Your account is currently under review by the administration."
    >
      <AuthCard className="flex flex-col items-center text-center gap-6 py-8">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-2">
          <LucideClock className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl font-heading text-forest-deep">Account Pending Approval</h3>
        
        <p className="text-sm font-body text-forest-light leading-relaxed max-w-sm">
          Thank you for registering. Your details have been securely submitted and are awating verification from the Admin desk. You will be notified once approved.
        </p>

        <Link 
          to="/" 
          className="mt-6 flex items-center gap-2 text-gold-dark hover:text-gold transition-colors font-semibold uppercase tracking-widest text-[10px]"
        >
          <LucideArrowLeft className="w-4 h-4" />
          Return to Estate
        </Link>
      </AuthCard>
    </AuthLayout>
  );
};

export default PendingPage;
