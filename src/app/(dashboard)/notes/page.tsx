'use client';

import React, { useState, useEffect } from 'react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Note {
  id: string;
  title: string;
  content: string;
  createdDate: string;
  updatedDate: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveNotesToLocalStorage = (notesToSave: Note[]) => {
    localStorage.setItem('notes', JSON.stringify(notesToSave));
    setNotes(notesToSave);
  };

  const handleCreateNote = () => {
    if (formData.title && formData.content) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };

      saveNotesToLocalStorage([...notes, newNote]);
      setFormData({ title: '', content: '' });
      setShowForm(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    saveNotesToLocalStorage(notes.filter((n) => n.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const handleExportPDF = (note: Note) => {
    const element = document.createElement('div');
    element.innerHTML = `
      <h1>${note.title}</h1>
      <p>${note.content}</p>
      <p>Created: ${new Date(note.createdDate).toLocaleDateString()}</p>
    `;

    const opts = {
      margin: 10,
      filename: `${note.title}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait' },
    };

    // Note: You'd need to import html2pdf library for this to work
    alert('PDF export coming soon!');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            Notes 📝
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Smart note-taking and organization
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Note'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Notes List */}
        <div className="lg:col-span-1">
          <GlassmorphicCard className="max-h-[600px] overflow-y-auto">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
              Your Notes
            </h3>
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedNote?.id === note.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white/10 dark:bg-slate-800/20 hover:bg-white/15 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <p className="font-semibold truncate">{note.title}</p>
                  <p className="text-xs opacity-70 truncate">{note.content.substring(0, 50)}...</p>
                </div>
              ))}
            </div>
          </GlassmorphicCard>
        </div>

        {/* Editor / Form */}
        <div className="lg:col-span-3">
          {showForm ? (
            <GlassmorphicCard>
              <div className="space-y-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Note title..."
                  autoFocus
                />

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Start typing..."
                    className="w-full h-64 px-4 py-3 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleCreateNote} className="flex-1">
                    Save Note
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </GlassmorphicCard>
          ) : selectedNote ? (
            <GlassmorphicCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {selectedNote.title}
                </h2>
                <div className="flex gap-3">
                  <Button size="sm" onClick={() => handleExportPDF(selectedNote)}>
                    📥 Export
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteNote(selectedNote.id)}
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none mb-6">
                <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                  {selectedNote.content}
                </p>
              </div>

              <div className="border-t border-white/10 dark:border-slate-700/20 pt-4">
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Created: {new Date(selectedNote.createdDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Updated: {new Date(selectedNote.updatedDate).toLocaleDateString()}
                </p>
              </div>
            </GlassmorphicCard>
          ) : (
            <GlassmorphicCard>
              <div className="flex flex-col items-center justify-center h-96">
                <p className="text-4xl mb-4">📝</p>
                <p className="text-neutral-600 dark:text-neutral-400 text-center">
                  Select a note or create a new one to get started
                </p>
              </div>
            </GlassmorphicCard>
          )}
        </div>
      </div>
    </div>
  );
}