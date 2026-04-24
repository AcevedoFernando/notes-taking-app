'use client';

import { memo, useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { hexToRgba } from '../../../utils/hexToRgba';
import type { Note, Category } from '../../../types';

interface NotePreviewProps {
  note: Note;
  category: Category;
  onNoteClick?: (note: Note) => void;
}

export const NotePreview = memo(function NotePreview({ note, category, onNoteClick }: NotePreviewProps) {
  const handleClick = useCallback(() => onNoteClick?.(note), [onNoteClick, note]);
  const sanitizedContent = useMemo(() => {
    if (typeof window === 'undefined') return note.content;
    return DOMPurify.sanitize(note.content);
  }, [note.content]);

  const formattedDate = useMemo(() => {
    const noteDate = new Date(note.updated_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (noteDate.toDateString() === today.toDateString()) return 'Today';
    if (noteDate.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return noteDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [note.updated_at]);

  return (
    <article
      className="w-full aspect-[6/5] overflow-hidden cursor-pointer"
      onClick={handleClick}
      style={{
        borderRadius: '11px',
        border: `3px solid ${category.color}`,
        backgroundColor: hexToRgba(category.color, 0.5),
        boxShadow: '1px 1px 2px 0px #00000040',
      }}
    >
      <div className="flex flex-col h-full p-3">
        <header
          className="flex items-center mb-2 shrink-0 text-meta"
        >
          <span className="font-bold text-black">{formattedDate}</span>
          <span className="text-black ml-[10px]">{category.name}</span>
        </header>

        <h3
          className="font-bold leading-tight mb-2 text-black title-note"
        >
          {note.title}
        </h3>

        <div
          className="flex-1 overflow-hidden text-xs text-black leading-snug"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
    </article>
  );
});
