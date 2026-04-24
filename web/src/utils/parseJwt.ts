export interface JwtPayload {
  user_id?: number;
  email?: string;
  username?: string;
  exp?: number;
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}
