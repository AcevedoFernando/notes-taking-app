'use client';

import { useEffect } from 'react';
import { Button } from '../components/atoms/Button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-base p-6 text-center">
      <h2 className="title-main mb-4 text-black">Something went wrong!</h2>
      <p className="mb-8 text-meta">We encountered an unexpected error. Please try again.</p>
      <Button onClick={() => reset()} className="w-auto px-8">
        Try again
      </Button>
    </div>
  );
}
