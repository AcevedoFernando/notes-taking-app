import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';

vi.mock('../../lib/notes', () => ({
  fetchNotes: vi.fn(),
  createNote: vi.fn(),
  updateNote: vi.fn(),
}));

import { fetchNotes, createNote, updateNote } from '../../lib/notes';
import { noteKeys, useNotes, useCreateNote, useUpdateNote } from '../../hooks/useNotes';

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client }, children);
  }
  return Wrapper;
}

const stubPage = { count: 1, next: null, previous: null, results: [{ id: 'n1', title: 'T', content: 'C', category: 'c1', updated_at: '' }] };

describe('noteKeys', () => {
  it('all returns the base notes key', () => {
    expect(noteKeys.all).toEqual(['notes']);
  });

  it('list without categoryId returns notes key with undefined categoryId', () => {
    expect(noteKeys.list()).toEqual(['notes', { categoryId: undefined }]);
  });

  it('list with categoryId includes it in the key', () => {
    expect(noteKeys.list('cat-123')).toEqual(['notes', { categoryId: 'cat-123' }]);
  });
});

describe('useNotes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchNotes).mockResolvedValue(stubPage);
  });

  it('fetches notes and returns first page results', async () => {
    const { result } = renderHook(() => useNotes(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages[0].results).toEqual(stubPage.results);
  });

  it('calls fetchNotes with the given categoryId', async () => {
    renderHook(() => useNotes('cat-abc'), { wrapper: makeWrapper() });
    await waitFor(() => expect(fetchNotes).toHaveBeenCalled());
    expect(vi.mocked(fetchNotes).mock.calls[0][0]).toBe('cat-abc');
  });

  it('getNextPageParam returns undefined when next is null', async () => {
    vi.mocked(fetchNotes).mockResolvedValue({ ...stubPage, next: null });
    const { result } = renderHook(() => useNotes(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(false);
  });

  it('getNextPageParam returns the next page number when next is set', async () => {
    vi.mocked(fetchNotes).mockResolvedValue({ ...stubPage, next: '2' });
    const { result } = renderHook(() => useNotes(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(true);
  });
});

describe('useCreateNote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createNote).mockResolvedValue({ id: 'n2', title: 'New', content: 'C', category: 'c1', updated_at: '' });
  });

  it('calls createNote with the given payload', async () => {
    const { result } = renderHook(() => useCreateNote(), { wrapper: makeWrapper() });
    const payload = { title: 'New', content: 'C', category: 'c1' };
    result.current.mutate(payload);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(createNote).toHaveBeenCalledWith(payload);
  });
});

describe('useUpdateNote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(updateNote).mockResolvedValue({ id: 'n1', title: 'Updated', content: 'C', category: 'c1', updated_at: '' });
  });

  it('calls updateNote with id and payload', async () => {
    const { result } = renderHook(() => useUpdateNote(), { wrapper: makeWrapper() });
    result.current.mutate({ id: 'n1', payload: { title: 'Updated' } });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updateNote).toHaveBeenCalledWith('n1', { title: 'Updated' });
  });
});
