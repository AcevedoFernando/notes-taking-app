'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useMe, useRevokeToken } from '../../../hooks/useAuth';
import { tokenStorage } from '../../../lib/tokenStorage';

function getInitials(email: string): string {
  return email
    .split('@')[0]
    .split(/[._-]/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function UserProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useMe();
  const { mutate: revokeToken, isPending: isLoggingOut } = useRevokeToken();

  function handleLogout() {
    const refresh = tokenStorage.getRefresh();
    const clearAndRedirect = () => {
      tokenStorage.clear();
      queryClient.clear();
      router.push('/auth/login');
    };
    if (refresh) {
      revokeToken(refresh, { onSettled: clearAndRedirect });
    } else {
      clearAndRedirect();
    }
  }

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
      >
        {getInitials(user.email)}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-primary truncate">{user.email}</span>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-1 text-xs text-secondary hover:opacity-70 disabled:opacity-40 transition-opacity w-fit"
        >
          <LogOut size={12} />
          {isLoggingOut ? 'Logging out…' : 'Log out'}
        </button>
      </div>
    </div>
  );
}
