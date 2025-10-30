'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  const getTitle = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    const title = segments[0] || 'Dashboard';
    return title.charAt(0).toUpperCase() + title.slice(1).replace('-', ' ');
  };

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-neutral-200 dark:border-slate-700 px-8 py-4">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
        {getTitle(pathname)}
      </h2>
    </div>
  );
}