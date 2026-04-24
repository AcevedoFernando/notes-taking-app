## Why

Atoms and Molecules are complete but the app has no navigable pages — users cannot reach the UI. Adding the auth flow and home dashboard wires the component library into real routes and makes the application usable end-to-end.

## What Changes

- Add `/auth/login` page: centered layout with cat illustration, "Yay, New Friend!" title, email + password inputs, "SignUp" button, and link to sign-up.
- Add `/auth/sign-up` page: centered layout with cactus illustration, "Yay, You're Back!" title, email + password inputs, "LogIn" button, and link to login.
- Add `/home` dashboard page: two-column split — 25% sidebar with "New Note" button and category filter list, 75% main content with `NotesList` and `NoteEditorModal`.
- Add a root redirect from `/` → `/auth/login`.
- Add a `CategoryFilters` sidebar component (used only on `/home`).

## Capabilities

### New Capabilities

- `auth-login-page`: `/auth/login` sign-up entry view with illustration, inputs, and navigation link.
- `auth-signup-page`: `/auth/sign-up` login view with illustration, inputs, and navigation link.
- `home-dashboard-page`: `/home` two-column layout with sidebar filters, NotesList, and NoteEditorModal integration.

### Modified Capabilities

## Impact

- New Next.js App Router route segments: `src/app/auth/login/`, `src/app/auth/sign-up/`, `src/app/home/`.
- Root `src/app/page.tsx` updated to redirect to `/auth/login`.
- New `CategoryFilters` component in `src/components/` (organism-level, used only by `/home`).
- No new external dependencies; relies on existing atoms, molecules, and `src/types/`.
- State management for auth form fields uses local `useState`; category filter selection uses local state on the home page.
- Public images (`/images/Cat.png`, `/images/cactus.png`, `/images/coffee.png`) must exist under `public/images/`.
