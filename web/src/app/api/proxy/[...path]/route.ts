import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const AUTH_ROUTES = ['/auth/token/', '/auth/register/'];
const REFRESH_ROUTE = '/auth/token/refresh/';
const REVOKE_ROUTE = '/auth/token/revoke/';

export async function ANY(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  let path = '/' + (params.path?.join('/') || '');
  if (!path.endsWith('/')) {
    path += '/';
  }
  const searchParams = req.nextUrl.searchParams.toString();
  const targetUrl = `${API_URL}${path}${searchParams ? `?${searchParams}` : ''}`;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('cookie');
  headers.delete('connection');
  headers.delete('content-length');

  // Attach access token to standard requests
  if (accessToken && !AUTH_ROUTES.includes(path) && path !== REFRESH_ROUTE) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await req.text() : undefined;

  // Intercept refresh and revoke token requests to inject the HttpOnly refresh token
  if ((path === REFRESH_ROUTE || path === REVOKE_ROUTE) && req.method === 'POST') {
    if (!refreshToken && path === REFRESH_ROUTE) {
      return NextResponse.json({ detail: 'No refresh token' }, { status: 401 });
    }
    if (!refreshToken && path === REVOKE_ROUTE) {
      // If there's no refresh token to blacklist, just clear local cookies and return success
      const nextResponse = NextResponse.json({ detail: 'Logged out locally' }, { status: 200 });
      nextResponse.cookies.delete('access_token');
      nextResponse.cookies.delete('refresh_token');
      return nextResponse;
    }
    if (refreshToken) {
      body = JSON.stringify({ refresh: refreshToken });
      headers.set('Content-Type', 'application/json');
    }
  }

  try {
    const res = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    const data = await res.text();
    const responseHeaders = new Headers(res.headers);
    responseHeaders.delete('set-cookie'); // We will set our own

    let nextResponse = new NextResponse(data, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });

    // Intercept auth responses to set HttpOnly cookies
    if (res.ok && (AUTH_ROUTES.includes(path) || path === REFRESH_ROUTE)) {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.access) {
          nextResponse.cookies.set('access_token', parsedData.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60, // 1 hour
          });
        }
        if (parsedData.refresh) {
          nextResponse.cookies.set('refresh_token', parsedData.refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
          });
        }
      } catch (e) {
        // Not a JSON response or missing tokens
      }
    } 
    
    // Always clear cookies on revoke, even if the backend returned an error (e.g. token already expired)
    if (path === REVOKE_ROUTE) {
      // Force status 200 so the frontend doesn't throw an error and stops the logout flow
      if (!res.ok) {
         nextResponse = NextResponse.json({ detail: 'Logged out locally (server rejected)' }, { status: 200, headers: nextResponse.headers });
      }

      nextResponse.cookies.delete('access_token');
      nextResponse.cookies.delete('refresh_token');
    }

    return nextResponse;
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = ANY;
export const POST = ANY;
export const PUT = ANY;
export const PATCH = ANY;
export const DELETE = ANY;
