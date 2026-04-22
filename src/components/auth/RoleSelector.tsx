import React from 'react';
import { LucideUser, LucideBriefcase, LucideShield } from 'lucide-react';
import { cn } from '@/lib/utils';

export type UserRole = 'admin' | 'member' | 'client';

interface RoleSelectorProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onChange }) => {
  const roles = [
    { id: 'client', label: 'Client', icon: LucideUser, desc: 'View bookings & visits' },
    { id: 'member', label: 'Team', icon: LucideBriefcase, desc: 'Manage leads & sales' },
    { id: 'admin', label: 'Admin', icon: LucideShield, desc: 'System-wide control' },
  ];

  return (
    <div className="flex flex-col gap-3 w-full mb-8">
      <p className="text-[10px] text-forest-light/60 font-body uppercase tracking-[0.2em] ml-2 mb-1">
        Select Access Type
      </p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = value === role.id;
          
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onChange(role.id as UserRole)}
              className={cn(
                "flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 gap-2 text-center",
                isActive 
                  ? "bg-forest-deep border-gold shadow-lg shadow-forest/20" 
                  : "bg-white/50 border-gold/5 hover:border-gold/20 hover:bg-white/80"
              )}
            >
              <div className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors",
                isActive ? "bg-gold text-forest-deep" : "bg-pista-light text-forest-light"
              )}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <span className={cn(
                  "text-xs sm:text-sm font-semibold tracking-wide",
                  isActive ? "text-cream" : "text-forest-deep"
                )}>
                  {role.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
