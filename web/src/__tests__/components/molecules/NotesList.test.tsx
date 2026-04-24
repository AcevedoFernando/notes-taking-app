import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

import { NotesList } from '../../../components/molecules/NotesList';
import type { Note, Category } from '../../../types';

const categories: Category[] = [
  { id: 'c1', name: 'Work', color: '#ff0000', notes_count: 2 },
  { id: 'c2', name: 'Personal', color: '#00ff00', notes_count: 1 },
];

function makeNote(id: string, categoryId = 'c1'): Note {
  return {
    id,
    title: `Note ${id}`,
    content: '<p>content</p>',
    updated_at: '2024-01-01T00:00:00Z',
    category: categoryId,
    category_name: 'Work',
  };
}

describe('NotesList', () => {
  describe('empty state', () => {
    it('shows the empty state image when there are no notes', () => {
      render(<NotesList notes={[]} categories={categories} />);
      expect(screen.getByRole('img', { name: 'Empty state' })).toBeInTheDocument();
    });

    it('shows the empty state message when there are no notes', () => {
      render(<NotesList notes={[]} categories={categories} />);
      expect(screen.getByText(/waiting for your charming notes/i)).toBeInTheDocument();
    });

    it('does not render the notes grid when empty', () => {
      const { container } = render(<NotesList notes={[]} categories={categories} />);
      expect(container.querySelector('.grid')).toBeNull();
    });
  });

  describe('notes rendering', () => {
    it('renders a card for each note', () => {
      const notes = [makeNote('1'), makeNote('2'), makeNote('3')];
      render(<NotesList notes={notes} categories={categories} />);
      expect(screen.getByRole('heading', { name: 'Note 1' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Note 2' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Note 3' })).toBeInTheDocument();
    });

    it('skips notes whose category is not in the categories list', () => {
      const notes = [makeNote('1', 'c1'), makeNote('orphan', 'unknown-cat')];
      render(<NotesList notes={notes} categories={categories} />);
      expect(screen.getByRole('heading', { name: 'Note 1' })).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Note orphan' })).toBeNull();
    });

    it('calls onNoteClick with the correct note when a card is clicked', async () => {
      const onNoteClick = vi.fn();
      const notes = [makeNote('1'), makeNote('2')];
      render(<NotesList notes={notes} categories={categories} onNoteClick={onNoteClick} />);
      await userEvent.click(screen.getByRole('heading', { name: 'Note 2' }).closest('article')!);
      expect(onNoteClick).toHaveBeenCalledWith(notes[1]);
    });
  });

  describe('loading indicator', () => {
    it('shows the loading indicator when isFetchingNextPage is true', () => {
      render(<NotesList notes={[makeNote('1')]} categories={categories} isFetchingNextPage />);
      expect(screen.getByText('Loading more…')).toBeInTheDocument();
    });

    it('hides the loading indicator when isFetchingNextPage is false', () => {
      render(<NotesList notes={[makeNote('1')]} categories={categories} isFetchingNextPage={false} />);
      expect(screen.queryByText('Loading more…')).toBeNull();
    });

    it('hides the loading indicator by default', () => {
      render(<NotesList notes={[makeNote('1')]} categories={categories} />);
      expect(screen.queryByText('Loading more…')).toBeNull();
    });
  });
});
