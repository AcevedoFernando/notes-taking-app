'use client';

import { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { NotePreview } from '../NotePreview';
import type { Note, Category } from '../../../types';

interface NotesListProps {
  notes: Note[];
  categories: Category[];
  onNoteClick?: (note: Note) => void;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

export function NotesList({ notes, categories, onNoteClick, onLoadMore, hasNextPage, isFetchingNextPage }: NotesListProps) {
  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories],
  );

  const onLoadMoreRef = useRef(onLoadMore);
  const hasNextPageRef = useRef(hasNextPage);
  const isFetchingNextPageRef = useRef(isFetchingNextPage);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
    hasNextPageRef.current = hasNextPage;
    isFetchingNextPageRef.current = isFetchingNextPage;
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      lastScrollY = currentScrollY;

      if (!scrollingDown || !hasNextPageRef.current || isFetchingNextPageRef.current) return;

      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      const scrollHeight = document.body.scrollHeight;
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        onLoadMoreRef.current?.();
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <Image src="/images/coffee.png" loading="eager" alt="Empty state" width={300} height={300} />
        <p className="title-note text-primary" >
          I&apos;m just here waiting for your charming notes…
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {notes.map((note) => {
        const category = categoryMap[note.category];
        if (!category) return null;
        return <NotePreview key={note.id} note={note} category={category} onNoteClick={onNoteClick} />;
      })}
      {isFetchingNextPage && (
        <div className="col-span-full flex justify-center py-4">
          <span className="text-secondary text-sm">Loading more…</span>
        </div>
      )}
    </div>
  );
}
