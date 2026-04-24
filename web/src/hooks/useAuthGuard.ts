'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '../lib/tokenStorage';

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    if (!tokenStorage.getAccess()) {
      router.replace('/auth/login');
    }
  }, [router]);
}
