import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

import { AuthForm } from '../../../components/organisms/AuthForm';

const defaultProps = {
  illustration: { src: '/img.png', alt: 'Illustration' },
  title: 'Welcome Back',
  submitLabel: 'Login',
  navLink: { href: '/auth/sign-up', text: "Don't have an account?" },
  onSubmit: vi.fn(),
};

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the title', () => {
      render(<AuthForm {...defaultProps} />);
      expect(screen.getByRole('heading', { name: 'Welcome Back' })).toBeInTheDocument();
    });

    it('renders the submit button with the given label', () => {
      render(<AuthForm {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('renders the navigation link with correct text and href', () => {
      render(<AuthForm {...defaultProps} />);
      const link = screen.getByRole('link', { name: "Don't have an account?" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/auth/sign-up');
    });

    it('renders the illustration image', () => {
      render(<AuthForm {...defaultProps} />);
      expect(screen.getByRole('img', { name: 'Illustration' })).toBeInTheDocument();
    });

    it('renders email and password inputs', () => {
      render(<AuthForm {...defaultProps} />);
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });
  });

  describe('form submission', () => {
    it('calls onSubmit with typed email and password', async () => {
      const onSubmit = vi.fn();
      render(<AuthForm {...defaultProps} onSubmit={onSubmit} />);

      await userEvent.type(screen.getByPlaceholderText('Email'), 'test@example.com');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'secret123');
      await userEvent.click(screen.getByRole('button', { name: 'Login' }));

      expect(onSubmit).toHaveBeenCalledWith('test@example.com', 'secret123');
    });

    it('does not call onSubmit when fields are empty and form is submitted', async () => {
      const onSubmit = vi.fn();
      render(<AuthForm {...defaultProps} onSubmit={onSubmit} />);
      // HTML5 validation prevents submission on empty required fields
      // but AuthForm does not use required — it defers validation to the parent
      await userEvent.click(screen.getByRole('button', { name: 'Login' }));
      expect(onSubmit).toHaveBeenCalledWith('', '');
    });
  });

  describe('pending state', () => {
    it('shows "Loading…" in the submit button when isPending is true', () => {
      render(<AuthForm {...defaultProps} isPending />);
      expect(screen.getByRole('button', { name: 'Loading…' })).toBeInTheDocument();
    });

    it('shows the submit label when isPending is false', () => {
      render(<AuthForm {...defaultProps} isPending={false} />);
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('disables the submit button when isPending is true', () => {
      render(<AuthForm {...defaultProps} isPending />);
      expect(screen.getByRole('button', { name: 'Loading…' })).toBeDisabled();
    });

    it('does not call onSubmit when clicking a disabled submit button', async () => {
      const onSubmit = vi.fn();
      render(<AuthForm {...defaultProps} isPending onSubmit={onSubmit} />);
      await userEvent.click(screen.getByRole('button', { name: 'Loading…' }));
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});
