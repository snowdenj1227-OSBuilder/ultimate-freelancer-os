'use client';

import React, { useEffect, useState } from 'react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils/formatting';
import { Client } from '@/lib/notion/types';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    address: '',
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/notion/clients');
        setClients(await response.json());
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/notion/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          relationship: 'Active',
        }),
      });

      if (response.ok) {
        const clientsRes = await fetch('/api/notion/clients');
        setClients(await clientsRes.json());
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          website: '',
          address: '',
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating client:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            Clients 👥
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">Manage your client relationships</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Client'}
        </Button>
      </div>

      {showForm && (
        <GlassmorphicCard className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Client Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
                required
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                required
              />

              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />

              <Input
                label="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company name"
              />
            </div>

            <Input
              label="Website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
            />

            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full address"
            />

            <Button type="submit" isLoading={loading} className="w-full">
              Add Client
            </Button>
          </form>
        </GlassmorphicCard>
      )}

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <GlassmorphicCard key={client.id} hover>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  {client.name}
                </h3>
                {client.company && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{client.company}</p>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  client.relationship === 'Active'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                }`}
              >
                {client.relationship}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {client.email && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  ✉️ {client.email}
                </p>
              )}
              {client.phone && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  📱 {client.phone}
                </p>
              )}
            </div>

            <div className="border-t border-white/10 dark:border-slate-700/20 pt-4">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                Lifetime Value
              </p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(client.lifetimeRevenue)}
              </p>
            </div>
          </GlassmorphicCard>
        ))}
      </div>
    </div>
  );
}