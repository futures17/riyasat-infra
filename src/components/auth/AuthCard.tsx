import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
  variant?: 'cream' | 'pista' | 'forest';
  className?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ children, variant = 'cream', className }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'pista':
        return 'bg-pista-light/40 border-pista/30';
      case 'forest':
        return 'bg-forest-deep text-cream border-forest-light/20 shadow-2xl';
      default:
        return 'bg-white/80 border-gold/10 backdrop-blur-md shadow-lg shadow-forest/5';
    }
  };

  return (
    <div className={`p-8 sm:p-10 rounded-3xl border ${getVariantStyles()} ${className || ''}`}>
      {children}
    </div>
  );
};

export default AuthCard;
