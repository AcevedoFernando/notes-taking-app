import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryFilters } from '../../../components/organisms/CategoryFilters';
import type { Category } from '../../../types';

const categories: Category[] = [
  { id: 'c1', name: 'Work', color: '#ff0000', notes_count: 5 },
  { id: 'c2', name: 'Personal', color: '#00ff00', notes_count: 2 },
  { id: 'c3', name: 'Ideas', color: '#0000ff', notes_count: 0 },
];

describe('CategoryFilters', () => {
  let onSelect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSelect = vi.fn();
  });

  describe('rendering', () => {
    it('renders the "All Categories" button', () => {
      render(<CategoryFilters categories={categories} activeCategoryId={null} onSelect={onSelect} />);
      expect(screen.getByRole('button', { name: 'All Categories' })).toBeInTheDocument();
    });

    it('renders a button for each category', () => {
      render(<CategoryFilters categories={categories} activeCategoryId={null} onSelect={onSelect} />);
      expect(screen.getByText('Work')).toBeInTheDocument();
      expect(screen.getByText('Personal')).toBeInTheDocument();
      expect(screen.getByText('Ideas')).toBeInTheDocument();
    });

    it('renders the note count for each category', () => {
      render(<CategoryFilters categories={categories} activeCategoryId={null} onSelect={onSelect} />);
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('selection callbacks', () => {
    it('calls onSelect(null) when "All Categories" is clicked', async () => {
      render(<CategoryFilters categories={categories} activeCategoryId="c1" onSelect={onSelect} />);
      await userEvent.click(screen.getByRole('button', { name: 'All Categories' }));
      expect(onSelect).toHaveBeenCalledWith(null);
    });

    it('calls onSelect with the category id when a category is clicked', async () => {
      render(<CategoryFilters categories={categories} activeCategoryId={null} onSelect={onSelect} />);
      await userEvent.click(screen.getByRole('button', { name: /Personal/ }));
      expect(onSelect).toHaveBeenCalledWith('c2');
    });

    it('calls onSelect once per click', async () => {
      render(<CategoryFilters categories={categories} activeCategoryId={null} onSelect={onSelect} />);
      await userEvent.click(screen.getByRole('button', { name: /Work/ }));
      expect(onSelect).toHaveBeenCalledOnce();
    });
  });

  describe('empty categories', () => {
    it('renders only the "All Categories" button when categories is empty', () => {
      render(<CategoryFilters categories={[]} activeCategoryId={null} onSelect={onSelect} />);
      expect(screen.getByRole('button', { name: 'All Categories' })).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(1);
    });
  });
});
