'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils/formatting';
import { Invoice } from '@/lib/notion/types';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/notion/invoices');
        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'Sent':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'Draft':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
      case 'Overdue':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            Invoices 📄
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage and track all your invoices
          </p>
        </div>
        <Link href="/invoices/create">
          <Button size="lg">+ Create Invoice</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <GlassmorphicCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 dark:border-slate-700/20">
                  <th className="text-left px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                    Invoice #
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                    Client
                  </th>
                  <th className="text-right px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                    Due Date
                  </th>
                  <th className="text-center px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-white/5 dark:border-slate-700/10 hover:bg-white/5 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                      {invoice.clientName}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-neutral-900 dark:text-white">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/invoices/${invoice.id}`}>
                        <button className="text-primary-600 dark:text-primary-400 hover:font-semibold transition-all">
                          View →
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassmorphicCard>
      )}
    </div>
  );
}