import React from 'react';
import type { Meta, StoryObj, Decorator } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomeDashboard } from '../components/organisms/HomeDashboard';
import type { Note, Category, User } from '../types';
import type { CategoriesResponse } from '../lib/categories';
import type { GetNotesResponse } from '../lib/notes';
import { noteKeys } from '../hooks/useNotes';

const CATEGORIES: Category[] = [
  { id: '1', name: 'Work', color: '#957139', notes_count: 3 },
  { id: '2', name: 'Personal', color: '#4CAF50', notes_count: 2 },
  { id: '3', name: 'Ideas', color: '#2196F3', notes_count: 1 },
];

const NOTES: Note[] = [
  { id: '1', title: 'Q2 Planning', content: '<p>Review OKRs and align team priorities.</p>', updated_at: '2026-04-22T10:00:00Z', category: '1', category_name: 'Work' },
  { id: '2', title: 'Sprint retro', content: '<p>What went well: shipping fast. Delta: more reviews.</p>', updated_at: '2026-04-21T09:00:00Z', category: '1', category_name: 'Work' },
  { id: '3', title: 'Weekend trip ideas', content: '<p>Mountains or beach? Let\'s vote.</p>', updated_at: '2026-04-20T08:00:00Z', category: '2', category_name: 'Personal' },
  { id: '4', title: 'Book list', content: '<ul><li>Thinking Fast and Slow</li><li>SICP</li></ul>', updated_at: '2026-04-19T07:00:00Z', category: '2', category_name: 'Personal' },
  { id: '5', title: 'App idea: habit tracker', content: '<p>Simple streaks, no noise.</p>', updated_at: '2026-04-18T06:00:00Z', category: '3', category_name: 'Ideas' },
  { id: '6', title: 'Blog post draft', content: '<p>Why defaults matter in product design.</p>', updated_at: '2026-04-17T05:00:00Z', category: '1', category_name: 'Work' },
];

const ME: User = { id: 1, email: 'fernando@example.com' };

function buildClient(notes: Note[]): QueryClient {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity }, mutations: { retry: false } },
  });

  const categoriesPayload: CategoriesResponse = {
    count: CATEGORIES.length,
    next: null,
    previous: null,
    results: CATEGORIES,
  };

  const notesPage: GetNotesResponse = {
    count: notes.length,
    next: null,
    previous: null,
    results: notes,
  };

  client.setQueryData(['categories'], categoriesPayload);
  client.setQueryData(noteKeys.list(undefined), {
    pages: [notesPage],
    pageParams: [1],
  });
  client.setQueryData(['me'], ME);

  return client;
}

function withQueryClient(notes: Note[]): Decorator {
  const client = buildClient(notes);
  return function StoryWithQueryClient(Story) {
    return (
      <QueryClientProvider client={client}>
        <Story />
      </QueryClientProvider>
    );
  };
}

const meta: Meta<typeof HomeDashboard> = {
  title: 'Organisms/HomeDashboard',
  component: HomeDashboard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
};
export default meta;
type Story = StoryObj<typeof HomeDashboard>;

export const WithNotes: Story = {
  decorators: [withQueryClient(NOTES)],
};

export const EmptyNotes: Story = {
  decorators: [withQueryClient([])],
};
