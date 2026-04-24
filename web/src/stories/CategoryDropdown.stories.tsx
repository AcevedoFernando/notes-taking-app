import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { CategoryDropdown } from '../components/molecules/CategoryDropdown';
import type { Category } from '../types';

const meta: Meta<typeof CategoryDropdown> = {
  title: 'Molecules/CategoryDropdown',
  component: CategoryDropdown,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8 bg-base h-48">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof CategoryDropdown>;

const categories: Category[] = [
  { id: '1', name: 'Work', color: '#957139', notes_count: 3 },
  { id: '2', name: 'Personal', color: '#4CAF50', notes_count: 1 },
  { id: '3', name: 'Ideas', color: '#2196F3', notes_count: 2 },
];

export const NoneSelected: Story = {
  args: {
    categories,
    selected: null,
    onChange: (cat) => console.log('selected', cat),
  },
};

export const WithSelection: Story = {
  args: {
    categories,
    selected: categories[0],
    onChange: (cat) => console.log('selected', cat),
  },
};

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState<Category | null>(null);
    return (
      <CategoryDropdown
        categories={categories}
        selected={selected}
        onChange={setSelected}
      />
    );
  },
};
