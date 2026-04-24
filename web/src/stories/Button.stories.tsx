import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Plus } from 'lucide-react';
import { Button } from '../components/atoms/Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-6 bg-base">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Save Note',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'New Note',
    icon: <Plus size={16} />,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Save Note',
    disabled: true,
  },
};
