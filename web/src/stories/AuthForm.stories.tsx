import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AuthForm } from '../components/organisms/AuthForm';

const meta: Meta<typeof AuthForm> = {
  title: 'Organisms/AuthForm',
  component: AuthForm,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof AuthForm>;

const signUpArgs = {
  illustration: { src: '/images/cat.png', alt: 'Cat illustration' },
  title: 'Yay, New Friend!',
  submitLabel: 'SignUp',
  navLink: { href: '/auth/login', text: "We're already friends!" },
  onSubmit: (email: string, password: string) => console.log('sign up', { email, password }),
};

const logInArgs = {
  illustration: { src: '/images/cactus.png', alt: 'Cactus illustration' },
  title: "Yay, You're Back!",
  submitLabel: 'LogIn',
  navLink: { href: '/auth/sign-up', text: "Oops! I've never been here before" },
  onSubmit: (email: string, password: string) => console.log('log in', { email, password }),
};

export const SignUp: Story = { args: signUpArgs };

export const LogIn: Story = { args: logInArgs };

export const Pending: Story = {
  args: { ...logInArgs, isPending: true },
};
