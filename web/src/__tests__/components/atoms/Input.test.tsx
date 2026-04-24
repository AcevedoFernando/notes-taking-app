import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../../../components/atoms/Input';

describe('Input', () => {
  describe('basic rendering', () => {
    it('renders with the given placeholder', () => {
      render(<Input placeholder="Enter email" />);
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    });

    it('renders with the given value', () => {
      render(<Input value="hello@example.com" onChange={vi.fn()} />);
      expect(screen.getByDisplayValue('hello@example.com')).toBeInTheDocument();
    });

    it('fires onChange when the user types', async () => {
      const onChange = vi.fn();
      render(<Input value="" onChange={onChange} />);
      await userEvent.type(screen.getByRole('textbox'), 'a');
      expect(onChange).toHaveBeenCalled();
    });

    it('defaults to type="text"', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('renders type="email" correctly', () => {
      render(<Input type="email" placeholder="Email" />);
      expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email');
    });
  });

  describe('password type', () => {
    it('renders a toggle button for password inputs', () => {
      render(<Input type="password" />);
      expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
    });

    it('does not render a toggle button for text inputs', () => {
      render(<Input type="text" />);
      expect(screen.queryByRole('button')).toBeNull();
    });

    it('does not render a toggle button for email inputs', () => {
      render(<Input type="email" />);
      expect(screen.queryByRole('button')).toBeNull();
    });

    it('hides password by default (input type is password)', () => {
      render(<Input type="password" placeholder="Password" />);
      expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
    });

    it('reveals password when toggle is clicked', async () => {
      render(<Input type="password" placeholder="Password" />);
      await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
      expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'text');
    });

    it('hides password again when toggle is clicked twice', async () => {
      render(<Input type="password" placeholder="Password" />);
      const toggle = screen.getByRole('button', { name: 'Show password' });
      await userEvent.click(toggle);
      await userEvent.click(screen.getByRole('button', { name: 'Hide password' }));
      expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
    });

    it('updates aria-label after toggle', async () => {
      render(<Input type="password" />);
      await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
      expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
    });
  });
});
