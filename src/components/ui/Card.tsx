import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function Card({ children, className = '', title, subtitle }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-slate-800 rounded-2xl p-6',
        'border border-neutral-200 dark:border-slate-700',
        'shadow-sm dark:shadow-lg',
        className
      )}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-sm text-neutral-600 dark:text-neutral-400">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
