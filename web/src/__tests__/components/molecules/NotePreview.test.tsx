import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotePreview } from '../../../components/molecules/NotePreview';
import type { Note, Category } from '../../../types';

const category: Category = { id: 'c1', name: 'Work', color: '#ff0000', notes_count: 3 };

function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: 'n1',
    title: 'My Test Note',
    content: '<p>Note content here</p>',
    updated_at: '2020-01-01T10:00:00Z',
    category: 'c1',
    category_name: 'Work',
    ...overrides,
  };
}

describe('NotePreview', () => {
  describe('content rendering', () => {
    it('renders the note title', () => {
      render(<NotePreview note={makeNote()} category={category} />);
      expect(screen.getByRole('heading', { name: 'My Test Note' })).toBeInTheDocument();
    });

    it('renders the category name', () => {
      render(<NotePreview note={makeNote()} category={category} />);
      expect(screen.getByText('Work')).toBeInTheDocument();
    });

    it('renders sanitized HTML content', () => {
      render(<NotePreview note={makeNote({ content: '<p>Hello <strong>world</strong></p>' })} category={category} />);
      expect(screen.getByText('world')).toBeInTheDocument();
    });

    it('strips dangerous HTML from content', () => {
      const { container } = render(
        <NotePreview note={makeNote({ content: '<script>alert("xss")</script>Safe text' })} category={category} />
      );
      expect(container.querySelector('script')).toBeNull();
      expect(screen.getByText('Safe text')).toBeInTheDocument();
    });
  });

  describe('date formatting', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('shows "Today" for notes updated today', () => {
      vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
      render(<NotePreview note={makeNote({ updated_at: '2024-06-15T08:00:00Z' })} category={category} />);
      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    it('shows "Yesterday" for notes updated yesterday', () => {
      vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
      render(<NotePreview note={makeNote({ updated_at: '2024-06-14T20:00:00Z' })} category={category} />);
      expect(screen.getByText('Yesterday')).toBeInTheDocument();
    });

    it('shows a formatted date for older notes', () => {
      vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
      render(<NotePreview note={makeNote({ updated_at: '2024-01-05T10:00:00Z' })} category={category} />);
      expect(screen.getByText('Jan 5, 2024')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onNoteClick with the note when clicked', async () => {
      const onNoteClick = vi.fn();
      const note = makeNote();
      render(<NotePreview note={note} category={category} onNoteClick={onNoteClick} />);
      await userEvent.click(screen.getByRole('article'));
      expect(onNoteClick).toHaveBeenCalledWith(note);
    });

    it('does not throw when clicked without an onNoteClick handler', async () => {
      render(<NotePreview note={makeNote()} category={category} />);
      await expect(userEvent.click(screen.getByRole('article'))).resolves.not.toThrow();
    });
  });
});
