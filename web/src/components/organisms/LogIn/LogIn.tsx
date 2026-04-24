'use client';

import { useRouter } from 'next/navigation';
import { AuthForm } from '../AuthForm';
import { useLogin } from '../../../hooks/useAuth';
import { tokenStorage } from '../../../lib/tokenStorage';

export function LogIn() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  function handleSubmit(email: string, password: string) {
    login({ email, password }, {
      onSuccess: ({ access, refresh }) => {
        tokenStorage.setTokens(access, refresh);
        router.push('/home');
      },
    });
  }

  return (
    <AuthForm
      illustration={{ src: '/images/cactus.png', alt: 'Cactus illustration' }}
      title="Yay, You're Back!"
      submitLabel="Login"
      navLink={{ href: '/auth/sign-up', text: "Oops! I've never been here before" }}
      isPending={isPending}
      onSubmit={handleSubmit}
    />
  );
}
