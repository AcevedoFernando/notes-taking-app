## 1. Root Redirect

- [x] 1.1 Update `src/app/page.tsx` to call `redirect('/auth/login')` from `next/navigation`

## 2. Auth Layout Foundation

- [x] 2.1 Create `src/app/auth/login/page.tsx` with full-page centered layout on `#FAF1E3`
- [x] 2.2 Add cat illustration (`/images/cat.png`), "Yay, New Friend!" heading, email + password Input atoms, "SignUp" Button atom, and "We're already friends!" link to `/auth/sign-up`
- [x] 2.3 Create `src/app/auth/sign-up/page.tsx` with full-page centered layout on `#FAF1E3`
- [x] 2.4 Add cactus illustration (`/images/cactus.png`), "Yay, You're Back!" heading, email + password Input atoms, "LogIn" Button atom, and "Oops! I've never been here before" link to `/auth/login`

## 3. Home Dashboard Page

- [x] 3.1 Create `src/app/home/page.tsx` as a Client Component with two-column split (25% sidebar / 75% main)
- [x] 3.2 Add mock `categories` and `notes` constants at the top of the home page file
- [x] 3.3 Implement `CategoryFilters` as an inline component: renders all categories as CategoryLabel items with an "All" option, highlights the active selection, and calls `onSelect` on click
- [x] 3.4 Wire category filter state: `useState` for `activeCategoryId`, filter `notes` by it before passing to `NotesList`
- [x] 3.5 Render `NotesList` molecule in the main content area with filtered notes and all categories
- [x] 3.6 Add "New Note" Button with `Plus` icon in the sidebar; `useState` for `isModalOpen`
- [x] 3.7 Render `NoteEditorModal` with `isOpen={isModalOpen}`, `onClose` setting it to `false`, and `onSave` as a console-log no-op
