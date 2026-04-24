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
  isLoading?: boolean;
}

export function NotesList({ notes, categories, onNoteClick, onLoadMore, hasNextPage, isFetchingNextPage, isLoading }: NotesListProps) {
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

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastScrollY = container.scrollTop;

    function handleScroll() {
      const currentScrollY = container?.scrollTop ?? 0;
      const scrollingDown = currentScrollY > lastScrollY;
      lastScrollY = currentScrollY;

      if (!scrollingDown || !hasNextPageRef.current || isFetchingNextPageRef.current) return;

      const scrollTop = container?.scrollTop ?? 0;
      const clientHeight = container?.clientHeight ?? 0;
      const scrollHeight = container?.scrollHeight ?? 0;
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        onLoadMoreRef.current?.();
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="h-full overflow-y-auto pr-4 pb-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <span className="text-secondary text-sm">Cargando notas...</span>
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 h-full">
          <Image src="/images/coffee.png" loading="eager" alt="Empty state" width={300} height={300} />
          <p className="title-note text-primary">
            I&apos;m just here waiting for your charming notes…
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
