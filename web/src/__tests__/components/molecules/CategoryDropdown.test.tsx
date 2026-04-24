import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryDropdown } from '../../../components/molecules/CategoryDropdown';
import type { Category } from '../../../types';

const categories: Category[] = [
  { id: 'c1', name: 'Work', color: '#ff0000', notes_count: 5 },
  { id: 'c2', name: 'Personal', color: '#00ff00', notes_count: 2 },
  { id: 'c3', name: 'Ideas', color: '#0000ff', notes_count: 0 },
];

describe('CategoryDropdown', () => {
  let onChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onChange = vi.fn();
  });

  describe('initial state', () => {
    it('shows the selected category name', () => {
      render(<CategoryDropdown categories={categories} selected={categories[1]} onChange={onChange} />);
      expect(screen.getByText('Personal')).toBeInTheDocument();
    });

    it('falls back to the first category when selected is null', () => {
      render(<CategoryDropdown categories={categories} selected={null} onChange={onChange} />);
      expect(screen.getByText('Work')).toBeInTheDocument();
    });

    it('starts with the dropdown closed', () => {
      render(<CategoryDropdown categories={categories} selected={categories[0]} onChange={onChange} />);
      expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('toggle button has aria-expanded="false" initially', () => {
      render(<CategoryDropdown categories={categories} selected={categories[0]} onChange={onChange} />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('opening and closing', () => {
    it('opens the dropdown when the trigger is clicked', async () => {
      render(<CategoryDropdown categories={categories} selected={categories[0]} onChange={onChange} />);
      await userEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('shows all categories in the list', async () => {
      render(<CategoryDropdown categories={categories} selected={categories[0]} onChange={onChange} />);
      await userEvent.click(screen.getByRole('button'));
      expect(screen.getAllByRole('option')).toHaveLength(3);
    });

    it('closes the dropdown when the trigger is clicked again', async () => {
      render(<CategoryDropdown categories={categories} selected={categories[0]} onChange={onChange} />);
      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByRole('button'));
      expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('sets aria-expanded="true" when open', async () => {
      render(<CategoryDropdown categories={categories} selected={categories[0]} onChange={onChange} />);
      await userEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('selection', () => {
    it('calls onChange with the clicked category', async () => {
      render(<CategoryDropdown categories={categories} selected={categories[0]} onChange={onChange} />);
      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getAllByRole('option')[1]);
      expect(onChange).toHaveBeenCalledWith(categories[1]);
    });

    it('closes the dropdown after a category is selected', async () => {
      render(<CategoryDropdown categories={categories} selected={categories[0]} onChange={onChange} />);
      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getAllByRole('option')[0]);
      expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('marks the selected option as aria-selected="true"', async () => {
      render(<CategoryDropdown categories={categories} selected={categories[1]} onChange={onChange} />);
      await userEvent.click(screen.getByRole('button'));
      const options = screen.getAllByRole('option');
      expect(options[1]).toHaveAttribute('aria-selected', 'true');
      expect(options[0]).toHaveAttribute('aria-selected', 'false');
    });
  });
});
