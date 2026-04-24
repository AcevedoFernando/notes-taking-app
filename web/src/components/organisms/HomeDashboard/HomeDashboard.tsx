'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Plus } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { NotesList } from '../../molecules/NotesList';
import { UserProfile } from '../../molecules/UserProfile';
import { CategoryFilters } from '../CategoryFilters';
import type { Note } from '../../../types';
import { useCategories } from '../../../hooks/useCategories';
import { useNotes } from '@/hooks/useNotes';

const NoteEditorModal = dynamic(
  () => import('../../molecules/NoteEditorModal').then((m) => ({ default: m.NoteEditorModal })),
  { ssr: false },
);

export function HomeDashboard() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { data: categoriesData } = useCategories();
  const categories = useMemo(() => categoriesData?.results ?? [], [categoriesData]);
  const { data: notesData, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching: isNotesFetching } = useNotes(activeCategoryId || undefined);
  const notes = useMemo(() => notesData?.pages.flatMap((page) => page.results) ?? [], [notesData]);

  const openNote = useCallback((note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  }, []);

  const openNewNote = useCallback(() => {
    setSelectedNote(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <div className="h-screen w-full flex flex-col bg-base p-8 relative overflow-hidden">
      <div className="w-full flex justify-end pb-4 shrink-0">
        <Button
          icon={<Plus size={18} />}
          onClick={openNewNote}
          className="justify-center"
        >
          New Note
        </Button>
      </div>
      <div className="flex flex-1 min-h-0">
        <aside className="w-1/5 flex flex-col gap-6 overflow-y-auto pr-2">
          <CategoryFilters
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelect={setActiveCategoryId}
          />
        </aside>

        <main className="flex-1 ml-6 h-full min-h-0">
          <NotesList
            notes={notes}
            categories={categories}
            onNoteClick={openNote}
            onLoadMore={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isLoading={!categoriesData || !notesData || (notes.length === 0 && isNotesFetching)}
          />
        </main>

        {isModalOpen && categories.length > 0 && (
          <NoteEditorModal
            key={selectedNote?.id ?? 'new'}
            isOpen={isModalOpen}
            categories={categories}
            initialNote={selectedNote ?? undefined}
            onClose={closeModal}
          />
        )}
      </div>

      <div className="fixed bottom-6 left-6">
        <UserProfile />
      </div>
    </div>
  );
}
