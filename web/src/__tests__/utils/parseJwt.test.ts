import { describe, it, expect } from 'vitest';
import { parseJwt } from '../../utils/parseJwt';

function makeToken(payload: object): string {
  const encoded = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `header.${encoded}.signature`;
}

describe('parseJwt', () => {
  it('parses a valid JWT and returns the payload', () => {
    const payload = { user_id: 42, email: 'user@example.com', exp: 9999999999 };
    const token = makeToken(payload);
    expect(parseJwt(token)).toEqual(payload);
  });

  it('returns null for a malformed token with no dots', () => {
    expect(parseJwt('notavalidtoken')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(parseJwt('')).toBeNull();
  });

  it('returns null when payload segment is not valid base64', () => {
    expect(parseJwt('header.!!!invalid!!!.signature')).toBeNull();
  });

  it('returns null when payload is not valid JSON', () => {
    const badPayload = btoa('not json at all');
    expect(parseJwt(`header.${badPayload}.signature`)).toBeNull();
  });

  it('handles a token with only some known fields', () => {
    const payload = { user_id: 1 };
    expect(parseJwt(makeToken(payload))).toEqual({ user_id: 1 });
  });

  it('handles URL-safe base64 characters (- and _)', () => {
    const payload = { email: 'test@example.com', username: 'test' };
    const token = makeToken(payload);
    expect(parseJwt(token)).toEqual(payload);
  });
});
