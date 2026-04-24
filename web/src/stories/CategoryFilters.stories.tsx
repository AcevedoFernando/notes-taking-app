import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { CategoryFilters } from '../components/organisms/CategoryFilters';

const meta: Meta<typeof CategoryFilters> = {
  title: 'Organisms/CategoryFilters',
  component: CategoryFilters,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-6 bg-base w-64">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof CategoryFilters>;

const categories = [
  { id: '1', name: 'Work', color: '#957139', notes_count: 3 },
  { id: '2', name: 'Personal', color: '#4CAF50', notes_count: 1 },
  { id: '3', name: 'Ideas', color: '#2196F3', notes_count: 2 },
];

export const AllSelected: Story = {
  args: {
    categories,
    activeCategoryId: null,
    onSelect: (id) => console.log('selected', id),
  },
};

export const CategorySelected: Story = {
  args: {
    categories,
    activeCategoryId: '2',
    onSelect: (id) => console.log('selected', id),
  },
};

export const Interactive: Story = {
  render: () => {
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    return (
      <CategoryFilters
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelect={setActiveCategoryId}
      />
    );
  },
};
