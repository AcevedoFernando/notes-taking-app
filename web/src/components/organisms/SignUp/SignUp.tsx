'use client';

import { useRouter } from 'next/navigation';
import { AuthForm } from '../AuthForm';
import { useRegister } from '../../../hooks/useAuth';
import { tokenStorage } from '../../../lib/tokenStorage';

export function SignUp() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();

  function handleSubmit(email: string, password: string) {
    register({ email, password }, {
      onSuccess: ({ access, refresh }) => {
        tokenStorage.setTokens(access, refresh);
        router.push('/home');
      },
    });
  }

  return (
    <AuthForm
      illustration={{ src: '/images/cat.png', alt: 'Cat illustration' }}
      title="Yay, New Friend!"
      submitLabel="Sign Up"
      navLink={{ href: '/auth/login', text: "We're already friends!" }}
      isPending={isPending}
      onSubmit={handleSubmit}
    />
  );
}
