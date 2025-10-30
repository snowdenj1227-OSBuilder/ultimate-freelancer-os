'use client';

import React, { useEffect, useState } from 'react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { KPICard } from '@/components/ui/KPICard';
import { formatCurrency } from '@/lib/utils/formatting';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState({
    monthlyRevenue: [
      { month: 'Jan', revenue: 2500, expenses: 800 },
      { month: 'Feb', revenue: 3200, expenses: 950 },
      { month: 'Mar', revenue: 2800, expenses: 750 },
      { month: 'Apr', revenue: 3500, expenses: 1100 },
      { month: 'May', revenue: 4200, expenses: 1300 },
      { month: 'Jun', revenue: 5100, expenses: 1200 },
    ],
    clientBreakdown: [
      { name: 'Client A', value: 4500 },
      { name: 'Client B', value: 3200 },
      { name: 'Client C', value: 2800 },
      { name: 'Others', value: 4600 },
    ],
  });

  const COLORS = ['#2563EB', '#FBBF24', '#10B981', '#F87171'];

  const totalRevenue = data.monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = data.monthlyRevenue.reduce((sum, m) => sum + m.expenses, 0);
  const avgMonthlyRevenue = totalRevenue / data.monthlyRevenue.length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
          Analytics 📈
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Detailed insights into your business performance
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard
          label="Total Revenue (6m)"
          value={formatCurrency(totalRevenue)}
          icon="💰"
          trend="up"
          trendValue="+18% YoY"
        />
        <KPICard
          label="Total Expenses (6m)"
          value={formatCurrency(totalExpenses)}
          icon="💸"
          trend="down"
          trendValue="-3% from target"
        />
        <KPICard
          label="Avg Monthly Revenue"
          value={formatCurrency(avgMonthlyRevenue)}
          icon="📊"
          trend="up"
          trendValue="+8% momentum"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue vs Expenses */}
        <GlassmorphicCard>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">
            Revenue vs Expenses
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#F87171" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </GlassmorphicCard>

        {/* Client Breakdown */}
        <GlassmorphicCard>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">
            Client Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.clientBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.clientBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </GlassmorphicCard>
      </div>

      {/* Monthly Bar Chart */}
      <GlassmorphicCard>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">
          Monthly Performance
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#2563EB" />
            <Bar dataKey="expenses" fill="#F87171" />
          </BarChart>
        </ResponsiveContainer>
      </GlassmorphicCard>
    </div>
  );
}