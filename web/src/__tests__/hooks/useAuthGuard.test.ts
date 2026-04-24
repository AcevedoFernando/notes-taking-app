import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('../../lib/tokenStorage', () => ({
  tokenStorage: {
    getAccess: vi.fn(),
  },
}));

import { tokenStorage } from '../../lib/tokenStorage';
import { useAuthGuard } from '../../hooks/useAuthGuard';

describe('useAuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /auth/login when no access token', () => {
    vi.mocked(tokenStorage.getAccess).mockReturnValue(null);
    renderHook(() => useAuthGuard());
    expect(mockReplace).toHaveBeenCalledWith('/auth/login');
  });

  it('does not redirect when access token is present', () => {
    vi.mocked(tokenStorage.getAccess).mockReturnValue('valid-token');
    renderHook(() => useAuthGuard());
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirects again on re-render if token has been removed', () => {
    vi.mocked(tokenStorage.getAccess)
      .mockReturnValueOnce('valid-token')
      .mockReturnValueOnce(null);

    const { rerender } = renderHook(() => useAuthGuard());
    expect(mockReplace).not.toHaveBeenCalled();

    rerender();
    expect(mockReplace).toHaveBeenCalledWith('/auth/login');
  });
});
