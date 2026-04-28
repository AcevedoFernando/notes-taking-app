'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';

interface AuthFormProps {
  illustration: { src: string; alt: string };
  title: string;
  submitLabel: string;
  navLink: { href: string; text: string };
  isPending?: boolean;
  errors?: Record<string, string[]>;
  onSubmit: (email: string, password: string) => void;
}

export function AuthForm({ illustration, title, submitLabel, navLink, isPending, errors, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <form
        className="flex flex-col items-center gap-6 w-full max-w-md px-6"
        onSubmit={(e) => { e.preventDefault(); onSubmit(email, password); }}
      >
        <Image
          src={illustration.src}
          alt={illustration.alt}
          width={160}
          height={160}
          priority
        />

        <h1
          className="title-main text-center"
        >
          {title}
        </h1>

        <div className="flex flex-col gap-3 w-11/12">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors?.email?.[0]}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors?.password?.[0]}
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-11/12 flex items-center justify-center"
        >
          {isPending ? 'Loading…' : submitLabel}
        </Button>

        <Link
          href={navLink.href}
          className="text-sm text-secondary hover:opacity-70 underline"
        >
          {navLink.text}
        </Link>
      </form>
    </div>
  );
}
