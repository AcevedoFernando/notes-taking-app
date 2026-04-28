'use client';

import { useEffect } from 'react';
import { Button } from '../components/atoms/Button';

export default function GlobalError({
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
    <html>
      <body>
        <div className="flex h-screen flex-col items-center justify-center bg-base p-6 text-center">
          <h2 className="title-main mb-4 text-black">A critical error occurred!</h2>
          <p className="mb-8 text-meta">The application encountered an unrecoverable error.</p>
          <Button onClick={() => reset()} className="w-auto px-8">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
