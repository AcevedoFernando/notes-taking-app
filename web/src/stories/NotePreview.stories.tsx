import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NotePreview } from '../components/molecules/NotePreview';

const meta: Meta<typeof NotePreview> = {
  title: 'Molecules/NotePreview',
  component: NotePreview,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8 bg-base max-w-sm">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof NotePreview>;

const workCategory = { id: '1', name: 'Work', color: '#957139', notes_count: 3 };
const personalCategory = { id: '2', name: 'Personal', color: '#4CAF50', notes_count: 1 };

export const Work: Story = {
  args: {
    note: {
      id: '1',
      title: 'Q2 Planning',
      content: '<p>Review OKRs and align team priorities for the next quarter.</p><ul><li>Budget review</li><li>Headcount plan</li></ul>',
      updated_at: '2026-04-20T10:30:00Z',
      category: '1',
      category_name: 'Work',
    },
    category: workCategory,
  },
};

export const Personal: Story = {
  args: {
    note: {
      id: '2',
      title: 'Weekend trip ideas',
      content: '<p>Looking for places to visit this summer. Mountains or beach?</p>',
      updated_at: '2026-04-18T08:00:00Z',
      category: '2',
      category_name: 'Personal',
    },
    category: personalCategory,
  },
};

const today = new Date();
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export const Today: Story = {
  args: {
    note: {
      id: '3',
      title: 'Standup notes',
      content: '<p>Shipped pagination, reviewing PRs next.</p>',
      updated_at: today.toISOString(),
      category: '1',
      category_name: 'Work',
    },
    category: workCategory,
  },
};

export const Yesterday: Story = {
  args: {
    note: {
      id: '4',
      title: 'Grocery list',
      content: '<p>Milk, eggs, bread, apples.</p>',
      updated_at: yesterday.toISOString(),
      category: '2',
      category_name: 'Personal',
    },
    category: personalCategory,
  },
};

export const LongContent: Story = {
  args: {
    note: {
      id: '5',
      title: 'Architecture decision record: Why we chose server-side rendering over static generation for the dashboard',
      content:
        '<p>After weighing trade-offs between ISR, SSR, and SSG, the team decided on SSR for the authenticated dashboard.</p><ul><li>Fresh data per request</li><li>Per-user content that can\'t be statically cached</li><li>Streaming keeps TTFB competitive</li></ul><p>We will revisit when the edge cache story matures.</p>',
      updated_at: '2026-04-10T12:00:00Z',
      category: '1',
      category_name: 'Work',
    },
    category: workCategory,
  },
};
