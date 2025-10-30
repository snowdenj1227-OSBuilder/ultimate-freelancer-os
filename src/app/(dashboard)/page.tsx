'use client';

import React, { useEffect, useState } from 'react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { KPICard } from '@/components/ui/KPICard';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/formatting';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    activeClients: 0,
    billableHours: 0,
    loading: true,
  });

  useEffect(() => {
    // TODO: Fetch from API
    setStats({
      totalRevenue: 12500,
      totalExpenses: 2300,
      netProfit: 10200,
      activeClients: 8,
      billableHours: 120,
      loading: false,
    });
  }, []);

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <KPICard
          label="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon="💰"
          trend="up"
          trendValue="+12% from last month"
        />
        <KPICard
          label="Total Expenses"
          value={formatCurrency(stats.totalExpenses)}
          icon="💸"
          trend="down"
          trendValue="-5% from last month"
        />
        <KPICard
          label="Net Profit"
          value={formatCurrency(stats.netProfit)}
          icon="📈"
          trend="up"
          trendValue="+15% from last month"
        />
        <KPICard
          label="Active Clients"
          value={stats.activeClients}
          icon="👥"
          trend="neutral"
          trendValue="2 new this month"
        />
        <KPICard
          label="Billable Hours"
          value={stats.billableHours}
          icon="⏱️"
          trend="up"
          trendValue="+8 hours this week"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Invoices */}
        <div className="lg:col-span-2">
          <GlassmorphicCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Recent Invoices
              </h3>
              <a href="/invoices" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                View all →
              </a>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-white/10 dark:bg-slate-800/20 rounded-lg hover:bg-white/15 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
                >
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">INV-00{i}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Client {i}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-900 dark:text-white">
                      {formatCurrency(1500 + i * 500)}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                      ✓ Paid
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassmorphicCard>
        </div>

        {/* Quick Actions */}
        <div>
          <GlassmorphicCard>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <a
                href="/invoices/create"
                className="block w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-center"
              >
                + New Invoice
              </a>
              <a
                href="/time-tracking"
                className="block w-full px-4 py-3 bg-gradient-to-r from-secondary-400 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-center"
              >
                ⏱️ Start Timer
              </a>
              <a
                href="/clients"
                className="block w-full px-4 py-3 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center"
              >
                👥 Add Client
              </a>
            </div>
          </GlassmorphicCard>
        </div>
      </div>
    </div>
  );
}