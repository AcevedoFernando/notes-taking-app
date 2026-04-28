import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ clear: vi.fn() }),
}));

vi.mock('../../../hooks/useAuth', () => ({
  useMe: vi.fn(),
  useRevokeToken: vi.fn(),
}));

vi.mock('../../../lib/tokenStorage', () => ({
  tokenStorage: {
    getRefresh: vi.fn(),
    clear: vi.fn(),
    getAccess: vi.fn(),
    setAccess: vi.fn(),
    setTokens: vi.fn(),
  },
}));

import { useMe, useRevokeToken } from '../../../hooks/useAuth';
import { tokenStorage } from '../../../lib/tokenStorage';
import { UserProfile } from '../../../components/molecules/UserProfile';

const DEFAULT_USER = { id: 1, email: 'user@example.com' };

function setupMocks(options: {
  user?: { id: number; email: string } | null;
  isLoggingOut?: boolean;
  mutate?: ReturnType<typeof vi.fn>;
} = {}) {
  const user = Object.prototype.hasOwnProperty.call(options, 'user') ? options.user : DEFAULT_USER;
  const { isLoggingOut = false, mutate = vi.fn() } = options;
  vi.mocked(useMe).mockReturnValue({ data: user ?? undefined } as ReturnType<typeof useMe>);
  vi.mocked(useRevokeToken).mockReturnValue({
    mutate,
    isPending: isLoggingOut,
  } as unknown as ReturnType<typeof useRevokeToken>);
}

describe('UserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when there is no user', () => {
    setupMocks({ user: null });
    const { container } = render(<UserProfile />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the user email', () => {
    setupMocks();
    render(<UserProfile />);
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  describe('initials', () => {
    it('generates initials from a simple email', () => {
      vi.mocked(useMe).mockReturnValue({ data: { id: 1, email: 'john.doe@example.com' } } as ReturnType<typeof useMe>);
      vi.mocked(useRevokeToken).mockReturnValue({ mutate: vi.fn(), isPending: false } as unknown as ReturnType<typeof useRevokeToken>);
      render(<UserProfile />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('generates a single initial when the local part has no separators', () => {
      vi.mocked(useMe).mockReturnValue({ data: { id: 1, email: 'alice@example.com' } } as ReturnType<typeof useMe>);
      vi.mocked(useRevokeToken).mockReturnValue({ mutate: vi.fn(), isPending: false } as unknown as ReturnType<typeof useRevokeToken>);
      render(<UserProfile />);
      expect(screen.getByText('A')).toBeInTheDocument();
    });
  });

  describe('logout', () => {
    it('renders the logout button', () => {
      setupMocks();
      render(<UserProfile />);
      expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    });

    it('calls revokeToken when clicked', async () => {
      const mutate = vi.fn();
      setupMocks({ mutate });

      render(<UserProfile />);
      await userEvent.click(screen.getByRole('button', { name: /log out/i }));

      expect(mutate).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ onSettled: expect.any(Function) }),
      );
    });

    it('clears query client and redirects after revokeToken settles', async () => {
      const mutate = vi.fn().mockImplementation((_token, { onSettled }) => onSettled());
      setupMocks({ mutate });

      render(<UserProfile />);
      await userEvent.click(screen.getByRole('button', { name: /log out/i }));

      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });

    it('shows "Logging out…" text when isLoggingOut is true', () => {
      setupMocks({ isLoggingOut: true });
      render(<UserProfile />);
      expect(screen.getByText('Logging out…')).toBeInTheDocument();
    });

    it('disables the logout button while logging out', () => {
      setupMocks({ isLoggingOut: true });
      render(<UserProfile />);
      expect(screen.getByRole('button', { name: /logging out/i })).toBeDisabled();
    });
  });
});
