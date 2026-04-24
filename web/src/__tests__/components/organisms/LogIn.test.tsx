import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

vi.mock('../../../hooks/useAuth', () => ({
  useLogin: vi.fn(),
}));

vi.mock('../../../lib/tokenStorage', () => ({
  tokenStorage: {
    setTokens: vi.fn(),
    getRefresh: vi.fn(),
    clear: vi.fn(),
  },
}));

import { useLogin } from '../../../hooks/useAuth';
import { tokenStorage } from '../../../lib/tokenStorage';
import { LogIn } from '../../../components/organisms/LogIn';

function setupLogin(mutate = vi.fn(), isPending = false) {
  vi.mocked(useLogin).mockReturnValue({
    mutate,
    isPending,
  } as unknown as ReturnType<typeof useLogin>);
}

describe('LogIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the correct form title', () => {
    setupLogin();
    render(<LogIn />);
    expect(screen.getByRole('heading', { name: "Yay, You're Back!" })).toBeInTheDocument();
  });

  it('renders the Login submit button', () => {
    setupLogin();
    render(<LogIn />);
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders the sign-up navigation link', () => {
    setupLogin();
    render(<LogIn />);
    const link = screen.getByRole('link', { name: /never been here before/i });
    expect(link).toHaveAttribute('href', '/auth/sign-up');
  });

  it('calls login mutation with email and password on submit', async () => {
    const mutate = vi.fn();
    setupLogin(mutate);
    render(<LogIn />);

    await userEvent.type(screen.getByPlaceholderText('Email'), 'user@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'mypassword');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(mutate).toHaveBeenCalledWith(
      { email: 'user@example.com', password: 'mypassword' },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it('stores tokens and navigates to /home on success', async () => {
    const mutate = vi.fn().mockImplementation((_creds, { onSuccess }) => {
      onSuccess({ access: 'acc-token', refresh: 'ref-token' });
    });
    setupLogin(mutate);
    render(<LogIn />);

    await userEvent.type(screen.getByPlaceholderText('Email'), 'user@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'pass');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(tokenStorage.setTokens).toHaveBeenCalledWith('acc-token', 'ref-token');
    expect(mockPush).toHaveBeenCalledWith('/home');
  });

  it('shows "Loading…" and disables the button while login is pending', () => {
    setupLogin(vi.fn(), true);
    render(<LogIn />);
    expect(screen.getByRole('button', { name: 'Loading…' })).toBeDisabled();
  });
});
