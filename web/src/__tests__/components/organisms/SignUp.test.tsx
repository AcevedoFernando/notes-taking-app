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
  useRegister: vi.fn(),
}));

vi.mock('../../../lib/tokenStorage', () => ({
  tokenStorage: {
    setTokens: vi.fn(),
    getRefresh: vi.fn(),
    clear: vi.fn(),
  },
}));

import { useRegister } from '../../../hooks/useAuth';
import { tokenStorage } from '../../../lib/tokenStorage';
import { SignUp } from '../../../components/organisms/SignUp';

function setupRegister(mutate = vi.fn(), isPending = false) {
  vi.mocked(useRegister).mockReturnValue({
    mutate,
    isPending,
  } as unknown as ReturnType<typeof useRegister>);
}

describe('SignUp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the correct form title', () => {
    setupRegister();
    render(<SignUp />);
    expect(screen.getByRole('heading', { name: 'Yay, New Friend!' })).toBeInTheDocument();
  });

  it('renders the Sign Up submit button', () => {
    setupRegister();
    render(<SignUp />);
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('renders the login navigation link', () => {
    setupRegister();
    render(<SignUp />);
    const link = screen.getByRole('link', { name: /already friends/i });
    expect(link).toHaveAttribute('href', '/auth/login');
  });

  it('calls register mutation with email and password on submit', async () => {
    const mutate = vi.fn();
    setupRegister(mutate);
    render(<SignUp />);

    await userEvent.type(screen.getByPlaceholderText('Email'), 'new@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'newpassword');
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(mutate).toHaveBeenCalledWith(
      { email: 'new@example.com', password: 'newpassword' },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it('stores tokens and navigates to /home on success', async () => {
    const mutate = vi.fn().mockImplementation((_creds, { onSuccess }) => {
      onSuccess({ access: 'acc-token', refresh: 'ref-token' });
    });
    setupRegister(mutate);
    render(<SignUp />);

    await userEvent.type(screen.getByPlaceholderText('Email'), 'new@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'pass');
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(tokenStorage.setTokens).toHaveBeenCalledWith('acc-token', 'ref-token');
    expect(mockPush).toHaveBeenCalledWith('/home');
  });

  it('shows "Loading…" and disables the button while registration is pending', () => {
    setupRegister(vi.fn(), true);
    render(<SignUp />);
    expect(screen.getByRole('button', { name: 'Loading…' })).toBeDisabled();
  });
});
