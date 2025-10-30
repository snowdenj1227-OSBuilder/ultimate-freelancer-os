'use client';

import React, { useEffect, useState } from 'react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatCurrency, formatDate } from '@/lib/utils/formatting';
import { Expense, Project } from '@/lib/notion/types';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Other',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    projectId: '',
    taxDeductible: false,
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, projectsRes] = await Promise.all([
          fetch('/api/notion/expenses'),
          fetch('/api/notion/projects'),
        ]);

        setExpenses(await expensesRes.json());
        setProjects(await projectsRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/notion/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (response.ok) {
        const expensesRes = await fetch('/api/notion/expenses');
        setExpenses(await expensesRes.json());
        setFormData({
          name: '',
          category: 'Other',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          projectId: '',
          taxDeductible: false,
          notes: '',
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const taxDeductibleExpenses = expenses
    .filter((exp) => exp.taxDeductible)
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            Expenses 💸
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">Track your business expenses</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Expense'}
        </Button>
      </div>

      {showForm && (
        <GlassmorphicCard className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expense Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Adobe Creative Cloud"
                required
              />

              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={[
                  { value: 'Software', label: 'Software' },
                  { value: 'Hardware', label: 'Hardware' },
                  { value: 'Travel', label: 'Travel' },
                  { value: 'Meal', label: 'Meal' },
                  { value: 'Other', label: 'Other' },
                ]}
              />

              <Input
                label="Amount (USD)"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />

              <Input
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <Select
              label="Project (Optional)"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
            />

            <Input
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add notes..."
            />

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.taxDeductible}
                onChange={(e) => setFormData({ ...formData, taxDeductible: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <span className="font-semibold text-neutral-900 dark:text-white">
                Tax deductible
              </span>
            </label>

            <Button type="submit" isLoading={loading} className="w-full">
              Save Expense
            </Button>
          </form>
        </GlassmorphicCard>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GlassmorphicCard>
          <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
            Total Expenses
          </p>
          <p className="text-4xl font-bold text-neutral-900 dark:text-white">
            {formatCurrency(totalExpenses)}
          </p>
        </GlassmorphicCard>

        <GlassmorphicCard>
          <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
            Tax Deductible
          </p>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(taxDeductibleExpenses)}
          </p>
        </GlassmorphicCard>
      </div>

      {/* Expenses List */}
      <GlassmorphicCard>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">
          All Expenses
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 dark:border-slate-700/20">
                <th className="text-left px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                  Name
                </th>
                <th className="text-left px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                  Category
                </th>
                <th className="text-right px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                  Amount
                </th>
                <th className="text-left px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                  Date
                </th>
                <th className="text-center px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                  Deductible
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-white/5 dark:border-slate-700/10 hover:bg-white/5 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">
                    {expense.name}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                    {expense.category}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-neutral-900 dark:text-white">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {expense.taxDeductible ? (
                      <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassmorphicCard>
    </div>
  );
}