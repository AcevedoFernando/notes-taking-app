'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { login, register, refreshToken, revokeToken, fetchMe } from '../lib/auth';
import type { AuthCredentials } from '../lib/auth';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: AuthCredentials) => login(credentials),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (credentials: AuthCredentials) => register(credentials),
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: (refresh: string) => refreshToken(refresh),
  });
}

export function useRevokeToken() {
  return useMutation({
    mutationFn: (refresh: string) => revokeToken(refresh),
  });
}
