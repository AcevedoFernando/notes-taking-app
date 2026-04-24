## Context

The component library (atoms + molecules) is complete. This change adds the three App Router routes that compose them into a real application: two auth screens and one dashboard. The existing `src/app/page.tsx` is the default Next.js placeholder and needs to become a redirect. All images already exist under `public/images/`.

## Goals / Non-Goals

**Goals:**
- Implement `/auth/login`, `/auth/sign-up`, and `/home` as Next.js App Router `page.tsx` files.
- Redirect `/` → `/auth/login` using Next.js `redirect()`.
- Add a `CategoryFilters` sidebar component (filter list + active-state highlight) used only by `/home`.
- Keep all pages as Client Components (`'use client'`) since they use local state for forms and filters.
- Use mock/static data on `/home` until a real API is wired (out of scope here).

**Non-Goals:**
- Real authentication logic — form submission logs to console or is a no-op; no JWT, session, or backend calls.
- Protected route middleware — no `middleware.ts` redirect guard in this change.
- API integration — `/home` uses hardcoded mock categories and notes.
- Responsive / mobile layout — desktop-first, matching the fixed-width design spec.

## Decisions

**App Router `page.tsx` per route, no layout nesting beyond root**
Each route gets its own `page.tsx`. The auth pages use a shared centered-column layout achieved with Tailwind classes directly — no extra `layout.tsx` needed for auth since both pages have the same simple centering. `/home` has its own two-column structure inline.

**Root redirect via `next/navigation` `redirect()`**
`src/app/page.tsx` calls `redirect('/auth/login')` so the root URL always forwards to login. This is a server-side redirect (no client JS needed) and is the idiomatic App Router pattern.

**`CategoryFilters` as an inline component in the home page file**
CategoryFilters is a small presentational list with active-highlight state. It's only used by `/home` and has no Storybook story requirement in this change. Keeping it co-located in `src/app/home/page.tsx` avoids premature extraction. It can be promoted to `src/components/` later if reuse emerges.

**Mock data defined as module-level constants on the home page**
Notes and categories are static arrays defined at the top of `page.tsx`. This makes it trivial to swap in a `useEffect`/fetch later without changing the component structure.

**`NoteEditorModal` open state managed with `useState` on `/home`**
The "New Note" button toggles `isModalOpen`. `onClose` sets it to `false`. `onSave` is a no-op console log for now.

## Risks / Trade-offs

- [Mock data on `/home` will mislead QA] → Clearly comment the mock data block so it's obvious to replace.
- [No route protection means `/home` is accessible without auth] → Acceptable for this change; middleware guard is a follow-up.
- [Fixed pixel widths on auth cards may clip on very small viewports] → Desktop-first; responsive is out of scope.
