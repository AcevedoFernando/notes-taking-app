'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CategoryDropdown } from '../CategoryDropdown';
import { hexToRgba } from '../../../utils/hexToRgba';
import { useCreateNote, useUpdateNote } from '../../../hooks/useNotes';
import type { Note, Category } from '../../../types';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface NoteEditorModalProps {
  isOpen: boolean;
  categories: Category[];
  initialNote?: Partial<Note>;
  onClose: () => void;
}

export function NoteEditorModal({ isOpen, categories, initialNote, onClose }: NoteEditorModalProps) {
  const [title, setTitle] = useState(initialNote?.title ?? '');
  const [content, setContent] = useState(initialNote?.content ?? '');
  const initialCategory = categories.find((c) => c.id === initialNote?.category);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    initialCategory ?? categories[0],
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const noteIdRef = useRef<string | undefined>(initialNote?.id);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const queryClient = useQueryClient();
  const { mutate: createNote } = useCreateNote();
  const { mutate: updateNote } = useUpdateNote();

  const formattedDate = useMemo(() => (
    initialNote?.updated_at ? new Date(initialNote.updated_at) : new Date()
  ).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }), [initialNote]);

  useEffect(() => {
    if (!title.trim() || !content.trim()) return;

    const timer = setTimeout(() => {
      const categoryId = selectedCategory?.id ?? '';
      setSaveStatus('saving');

      function onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        setSaveStatus('saved');
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
      }

      function onError() {
        setSaveStatus('error');
      }

      if (noteIdRef.current) {
        updateNote(
          { id: noteIdRef.current, payload: { title, content, category: categoryId } },
          { onSuccess, onError },
        );
      } else {
        createNote(
          { title, content, category: categoryId },
          {
            onSuccess: (note) => {
              noteIdRef.current = note.id;
              onSuccess();
            },
            onError,
          },
        );
      }
    }, 1000);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, selectedCategory]);

  const color = selectedCategory?.color ?? '#957139';

  const statusLabel = useMemo<Record<SaveStatus, string>>(() => ({
    idle: `Last Edited: ${formattedDate}`,
    saving: 'Saving…',
    saved: 'Saved ✓',
    error: 'Error saving',
  }), [formattedDate]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative border-custom flex flex-col overflow-hidden p-8 w-full h-full bg-base"
      >
        <div className="flex items-center justify-between mb-3">
          <CategoryDropdown
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
          <button
            type="button"
            onClick={onClose}
            className="text-secondary text-xl hover:opacity-70"
            aria-label="Close editor"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 flex flex-col mb-4 py-8 px-16 rounded-[11px]" style={{ backgroundColor: hexToRgba(color, 0.5), border: `3px solid ${color}` }}>
          <div className="w-full flex">
            <span className="ml-auto text-sm text-black">{statusLabel[saveStatus]}</span>
          </div>
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-black title-note font-bold my-2 order-none outline-none placeholder:text-black/40"
            style={{ fontFamily: 'Inria Serif, serif' }}
          />
          <textarea
            placeholder="Pour your heart out.."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 w-full resize-none text-black text-[16px] outline-none py-2 placeholder:text-secondary/50"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>
      </div>
    </div>
  );
}
