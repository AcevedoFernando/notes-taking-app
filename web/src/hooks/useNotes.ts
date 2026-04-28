'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, createNote, updateNote } from '../lib/notes';
import type { NotePayload } from '../lib/notes';

export const noteKeys = {
  all: ['notes'] as const,
  list: (categoryId?: string) => ['notes', { categoryId }] as const,
};

export function useNotes(categoryId?: string) {
  return useInfiniteQuery({
    queryKey: noteKeys.list(categoryId),
    queryFn: ({ pageParam }) => fetchNotes(categoryId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      // Handle if the backend returns a raw page number (e.g., 2)
      if (!String(lastPage.next).startsWith('http')) {
        return Number(lastPage.next);
      }
      // Handle if the backend returns an absolute URL (e.g., http://api/notes?page=2)
      try {
        const url = new URL(lastPage.next);
        const page = url.searchParams.get('page');
        return page ? Number(page) : undefined;
      } catch (e) {
        return undefined;
      }
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NotePayload) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<NotePayload> }) =>
      updateNote(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all });
    },
  });
}
