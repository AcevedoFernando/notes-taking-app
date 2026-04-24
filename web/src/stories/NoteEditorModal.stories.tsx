import React from 'react';
import type { Meta, StoryObj, Decorator } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NoteEditorModal } from '../components/molecules/NoteEditorModal';

function withQueryClient(): Decorator {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function StoryWithQueryClient(Story) {
    return (
      <QueryClientProvider client={client}>
        <Story />
      </QueryClientProvider>
    );
  };
}

const meta: Meta<typeof NoteEditorModal> = {
  title: 'Molecules/NoteEditorModal',
  component: NoteEditorModal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [withQueryClient()],
};
export default meta;
type Story = StoryObj<typeof NoteEditorModal>;

const categories = [
  { id: '1', name: 'Work', color: '#957139', notes_count: 3 },
  { id: '2', name: 'Personal', color: '#4CAF50', notes_count: 1 },
  { id: '3', name: 'Ideas', color: '#2196F3', notes_count: 2 },
];

export const Open: Story = {
  args: {
    isOpen: true,
    categories,
    initialNote: {
      title: 'Q2 Planning',
      content: 'Review OKRs and align team priorities.',
      category: '1',
      category_name: 'Work',
      updated_at: '2026-04-20T10:30:00Z',
    },
    onClose: () => console.log('close'),
  },
};

export const NewNote: Story = {
  args: {
    isOpen: true,
    categories,
    onClose: () => console.log('close'),
  },
};
