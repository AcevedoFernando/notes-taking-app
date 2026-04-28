'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '../AuthForm';
import { useRegister } from '../../../hooks/useAuth';
import { ApiError } from '../../../lib/apiClient';

export function SignUp() {
  const router = useRouter();
  const { mutate: register, isPending, error } = useRegister();
  const [received, setReceived] = useState(false);
  const apiError = error as ApiError | null;

  function handleSubmit(email: string, password: string) {
    register({ email, password }, {
      onSuccess: (data) => {
        if ('access' in data) {
          router.push('/home');
        } else {
          setReceived(true);
        }
      },
    });
  }

  if (received) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <p className="text-center text-secondary">
          Thanks! If this email isn&apos;t registered yet, check your inbox to continue.
        </p>
      </div>
    );
  }

  return (
    <AuthForm
      illustration={{ src: '/images/cat.png', alt: 'Cat illustration' }}
      title="Yay, New Friend!"
      submitLabel="Sign Up"
      navLink={{ href: '/auth/login', text: "We're already friends!" }}
      isPending={isPending}
      errors={apiError?.fields}
      onSubmit={handleSubmit}
    />
  );
}
