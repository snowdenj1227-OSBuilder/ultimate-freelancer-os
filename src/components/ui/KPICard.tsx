import React from 'react';
import clsx from 'clsx';

interface KPICardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function KPICard({
  label,
  value,
  icon,
  trend = 'neutral',
  trendValue,
  className = '',
}: KPICardProps) {
  return (
    <div
      className={clsx(
        'relative backdrop-blur-lg bg-gradient-to-br from-white/20 to-white/10',
        'dark:from-slate-900/40 dark:to-slate-900/20',
        'border border-white/30 dark:border-slate-700/30',
        'rounded-2xl p-6',
        'shadow-glass',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
            {label}
          </p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">{value}</p>
          {trendValue && (
            <p
              className={clsx(
                'text-xs font-semibold',
                trend === 'up' && 'text-green-600 dark:text-green-400',
                trend === 'down' && 'text-red-600 dark:text-red-400',
                trend === 'neutral' && 'text-neutral-600 dark:text-neutral-400'
              )}
            >
              {trend === 'up' && '↑ '}
              {trend === 'down' && '↓ '}
              {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-primary-600 dark:text-primary-400 opacity-30">{icon}</div>
        )}
      </div>
    </div>
  );
}
