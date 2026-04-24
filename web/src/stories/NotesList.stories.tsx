import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NotesList } from '../components/molecules/NotesList';

const meta: Meta<typeof NotesList> = {
  title: 'Molecules/NotesList',
  component: NotesList,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8 bg-base min-h-screen">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof NotesList>;

const categories = [
  { id: '1', name: 'Work', color: '#957139', notes_count: 3 },
  { id: '2', name: 'Personal', color: '#4CAF50', notes_count: 2 },
  { id: '3', name: 'Ideas', color: '#2196F3', notes_count: 1 },
];

const notes = [
  { id: '1', title: 'Q2 Planning', content: '<p>Review OKRs for next quarter.</p>', updated_at: '2026-04-20T10:30:00Z', category: '1', category_name: 'Work' },
  { id: '2', title: 'Weekend trip', content: '<p>Mountains or beach?</p>', updated_at: '2026-04-18T08:00:00Z', category: '2', category_name: 'Personal' },
  { id: '3', title: 'App feature idea', content: '<p>Dark mode toggle on the sidebar.</p>', updated_at: '2026-04-15T14:00:00Z', category: '3', category_name: 'Ideas' },
  { id: '4', title: 'Meeting notes', content: '<p>Follow up with design team.</p>', updated_at: '2026-04-14T09:00:00Z', category: '1', category_name: 'Work' },
  { id: '5', title: 'Book list', content: '<ul><li>Dune</li><li>Sapiens</li></ul>', updated_at: '2026-04-12T11:00:00Z', category: '2', category_name: 'Personal' },
  { id: '6', title: 'Side project', content: '<p>Build a notes app with Next.js.</p>', updated_at: '2026-04-10T16:00:00Z', category: '3', category_name: 'Ideas' },
];

export const Populated: Story = {
  args: { notes, categories },
};

export const Empty: Story = {
  args: { notes: [], categories },
};
