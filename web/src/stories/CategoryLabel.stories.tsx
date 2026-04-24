import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CategoryLabel } from '../components/atoms/CategoryLabel';

const meta: Meta<typeof CategoryLabel> = {
  title: 'Atoms/CategoryLabel',
  component: CategoryLabel,
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
type Story = StoryObj<typeof CategoryLabel>;

export const Work: Story = {
  args: {
    name: 'Work',
    color: '#957139',
  },
};

export const Personal: Story = {
  args: {
    name: 'Personal',
    color: '#4CAF50',
  },
};

export const Ideas: Story = {
  args: {
    name: 'Ideas',
    color: '#2196F3',
  },
};
