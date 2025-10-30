import React from 'react';
import clsx from 'clsx';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function GlassmorphicCard({
  children,
  className = '',
  onClick,
  hover = true,
}: GlassmorphicCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative backdrop-blur-lg bg-white/10 dark:bg-slate-900/20',
        'border border-white/20 dark:border-slate-700/20',
        'rounded-2xl p-6',
        'shadow-glass',
        hover && 'hover:shadow-glass-lg hover:bg-white/15 dark:hover:bg-slate-900/30 transition-all duration-300 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}