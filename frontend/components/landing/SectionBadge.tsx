import React from 'react';

interface SectionBadgeProps {
  label: string;
  className?: string;
}

export const SectionBadge = ({ label, className = '' }: SectionBadgeProps) => {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-theme-300/60 dark:to-brand-primary/40" />
      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-theme-600/80 dark:text-brand-primary/80 px-5 py-2 rounded-full border border-theme-200 dark:border-brand-primary/15 bg-theme-50 dark:bg-brand-primary/[0.04]">
        {label}
      </span>
      <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-theme-300/60 dark:to-brand-primary/40" />
    </div>
  );
};



