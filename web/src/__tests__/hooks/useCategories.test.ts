import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';

vi.mock('../../lib/categories', () => ({
  fetchCategories: vi.fn(),
}));

import { fetchCategories } from '../../lib/categories';
import { useCategories } from '../../hooks/useCategories';

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client }, children);
  }
  return Wrapper;
}

const stubResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    { id: 'c1', name: 'Work', color: '#ff0000', notes_count: 5 },
    { id: 'c2', name: 'Personal', color: '#00ff00', notes_count: 2 },
  ],
};

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls fetchCategories on mount', async () => {
    vi.mocked(fetchCategories).mockResolvedValueOnce(stubResponse);
    renderHook(() => useCategories(), { wrapper: makeWrapper() });
    await waitFor(() => expect(fetchCategories).toHaveBeenCalledTimes(1));
  });

  it('returns categories data on success', async () => {
    vi.mocked(fetchCategories).mockResolvedValueOnce(stubResponse);
    const { result } = renderHook(() => useCategories(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(stubResponse);
  });

  it('returns error state when fetchCategories fails', async () => {
    vi.mocked(fetchCategories).mockRejectedValueOnce(new Error('Network error'));
    const { result } = renderHook(() => useCategories(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('uses ["categories"] as query key', async () => {
    vi.mocked(fetchCategories).mockResolvedValueOnce(stubResponse);
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children);

    renderHook(() => useCategories(), { wrapper });
    await waitFor(() => expect(queryClient.getQueryData(['categories'])).toEqual(stubResponse));
  });
});
