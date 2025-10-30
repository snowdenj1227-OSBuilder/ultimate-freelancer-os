'use client';

import React, { useEffect, useState } from 'react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Select } from '@/components/ui/Select';
import { Setting } from '@/lib/notion/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [theme, setTheme] = useState('light');
  const [font, setFont] = useState('Inter');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/notion/settings');
        const data = await response.json();
        setSettings(data);

        // Set theme from settings
        const themeSetting = data.find((s: Setting) => s.settingKey === 'active_theme');
        if (themeSetting) {
          setTheme(themeSetting.settingValue);
        }

        const fontSetting = data.find((s: Setting) => s.settingKey === 'font_family');
        if (fontSetting) {
          setFont(fontSetting.settingValue);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const themes = [
    { value: 'light', label: '☀️ Light' },
    { value: 'dark', label: '🌙 Dark' },
    { value: 'theme1-blue', label: '🔵 Blue' },
    { value: 'theme2-purple', label: '🟣 Purple' },
    { value: 'theme3-green', label: '🟢 Green' },
  ];

  const fonts = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Courier', label: 'Courier' },
  ];

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
          Settings ⚙️
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Customize your Ultimate Freelancer OS
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <GlassmorphicCard>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Appearance</h3>

          <div className="space-y-4">
            <Select
              label="Theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              options={themes}
            />

            <Select
              label="Font Family"
              value={font}
              onChange={(e) => setFont(e.target.value)}
              options={fonts}
            />
          </div>
        </GlassmorphicCard>

        {/* API Configuration */}
        <GlassmorphicCard>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">
            Integrations
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-white/10 dark:bg-slate-800/20 rounded-lg">
              <p className="font-semibold text-neutral-900 dark:text-white mb-2">Notion</p>
              <p className="text-sm text-green-600 dark:text-green-400">✓ Connected</p>
            </div>

            <div className="p-4 bg-white/10 dark:bg-slate-800/20 rounded-lg">
              <p className="font-semibold text-neutral-900 dark:text-white mb-2">Stripe</p>
              <p className="text-sm text-green-600 dark:text-green-400">✓ Connected</p>
            </div>

            <div className="p-4 bg-white/10 dark:bg-slate-800/20 rounded-lg">
              <p className="font-semibold text-neutral-900 dark:text-white mb-2">Plaid (Coming Soon)</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Phase 2</p>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Account */}
        <GlassmorphicCard>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Account</h3>

          <div className="space-y-4">
            <div className="p-4 bg-white/10 dark:bg-slate-800/20 rounded-lg">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Version</p>
              <p className="font-semibold text-neutral-900 dark:text-white">0.1.0</p>
            </div>

            <div className="p-4 bg-white/10 dark:bg-slate-800/20 rounded-lg">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Last Updated</p>
              <p className="font-semibold text-neutral-900 dark:text-white">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  );
}