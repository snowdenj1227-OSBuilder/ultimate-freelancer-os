'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/invoices', label: 'Invoices', icon: '📄' },
  { href: '/clients', label: 'Clients', icon: '👥' },
  { href: '/time-tracking', label: 'Time Tracking', icon: '⏱️' },
  { href: '/expenses', label: 'Expenses', icon: '💸' },
  { href: '/projects', label: 'Projects', icon: '📁' },
  { href: '/tasks', label: 'Tasks', icon: '✓' },
  { href: '/leads', label: 'Leads', icon: '🎯' },
  { href: '/notes', label: 'Notes', icon: '📝' },
  { href: '/analytics', label: 'Analytics', icon: '📈' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={clsx(
        'fixed left-0 top-0 h-screen',
        'bg-gradient-to-b from-neutral-900 to-neutral-950 dark:from-neutral-950 dark:to-neutral-900',
        'border-r border-neutral-800',
        'transition-all duration-300',
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex items-center justify-between p-4">
        {isOpen && (
          <h1 className="text-xl font-bold text-white">UFO</h1>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:bg-neutral-800 p-2 rounded-lg transition-colors"
        >
          {isOpen ? '←' : '→'}
        </button>
      </div>

      <nav className="mt-8 space-y-2 px-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
              pathname === item.href
                ? 'bg-primary-600 text-white'
                : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            {isOpen && <span className="text-sm font-semibold">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}