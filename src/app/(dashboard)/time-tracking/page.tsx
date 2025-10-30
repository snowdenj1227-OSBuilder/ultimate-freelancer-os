'use client';

import React, { useState, useEffect } from 'react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatTime, formatCurrency } from '@/lib/utils/formatting';
import { TimeEntry, Project } from '@/lib/notion/types';

export default function TimeTrackingPage() {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    projectId: '',
    hourlyRate: '50',
    billable: true,
  });

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entriesRes, projectsRes] = await Promise.all([
          fetch('/api/notion/time-entries'),
          fetch('/api/notion/projects'),
        ]);

        setTimeEntries(await entriesRes.json());
        setProjects(await projectsRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleSaveTime = async () => {
    try {
      const hours = timer / 3600;

      const response = await fetch('/api/notion/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          projectId: formData.projectId,
          durationHours: parseFloat(hours.toFixed(2)),
          billable: formData.billable,
          hourlyRate: parseFloat(formData.hourlyRate),
          entryType: 'Timer',
        }),
      });

      if (response.ok) {
        setTimer(0);
        setIsRunning(false);
        // Refresh entries
        const entriesRes = await fetch('/api/notion/time-entries');
        setTimeEntries(await entriesRes.json());
      }
    } catch (error) {
      console.error('Error saving time entry:', error);
    }
  };

  const formatTimerDisplay = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      secs
    ).padStart(2, '0')}`;
  };

  const totalEarnings = timeEntries
    .filter((entry) => entry.billable)
    .reduce((sum, entry) => sum + entry.amountEarned, 0);

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.durationHours, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
          Time Tracking ⏱️
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">Track your billable hours</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timer */}
        <div className="lg:col-span-2">
          <GlassmorphicCard>
            <div className="text-center">
              <div className="text-7xl font-bold text-primary-600 dark:text-primary-400 font-mono mb-8 tracking-wider">
                {formatTimerDisplay(timer)}
              </div>

              <div className="flex gap-4 mb-8 justify-center">
                <Button
                  onClick={handleStartStop}
                  variant={isRunning ? 'primary' : 'secondary'}
                  size="lg"
                >
                  {isRunning ? '⏸️ Pause' : '▶️ Start'}
                </Button>
                <Button
                  onClick={() => setTimer(0)}
                  variant="outline"
                  size="lg"
                  disabled={isRunning}
                >
                  🔄 Reset
                </Button>
              </div>

              <div className="space-y-4">
                <Select
                  label="Project"
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  options={projects.map((p) => ({ value: p.id, label: p.name }))}
                />

                <Input
                  label="Hourly Rate (USD)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                />

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.billable}
                    onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    Mark as billable
                  </span>
                </label>

                <Button
                  onClick={handleSaveTime}
                  size="lg"
                  className="w-full"
                  disabled={timer === 0}
                >
                  💾 Save Time Entry
                </Button>
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Stats */}
        <div className="space-y-6">
          <GlassmorphicCard>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Today</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Total Hours</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {formatTime(totalHours)}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Earnings</p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {formatCurrency(totalEarnings)}
                </p>
              </div>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
              Recent Entries
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {timeEntries.slice(-5).reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 bg-white/10 dark:bg-slate-800/20 rounded-lg"
                >
                  <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                    {formatTime(entry.durationHours)}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {formatCurrency(entry.amountEarned)}
                  </p>
                </div>
              ))}
            </div>
          </GlassmorphicCard>
        </div>
      </div>
    </div>
  );
}