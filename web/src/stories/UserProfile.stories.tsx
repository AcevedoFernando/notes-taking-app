import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProfile } from '../components/molecules/UserProfile';
import type { User } from '../types';

function withUser(user: User | undefined) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  if (user) client.setQueryData(['me'], user);

  return function Decorator(Story: React.ComponentType) {
    return (
      <QueryClientProvider client={client}>
        <div className="p-6 bg-base">
          <Story />
        </div>
      </QueryClientProvider>
    );
  };
}

const meta: Meta<typeof UserProfile> = {
  title: 'Molecules/UserProfile',
  component: UserProfile,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof UserProfile>;

export const Default: Story = {
  decorators: [withUser({ id: 1, email: 'fernando.acevedo@example.com' })],
};

export const ShortEmail: Story = {
  decorators: [withUser({ id: 2, email: 'a@b.co' })],
};

export const NotLoaded: Story = {
  decorators: [withUser(undefined)],
};
