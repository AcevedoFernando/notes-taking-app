## Context

The Atom layer (Input, Button, CategoryLabel) is complete. Molecules compose those atoms into the three visible UI units the app actually shows: a note card, a grid of cards, and a note editing modal. Two new concerns arise at this tier that didn't exist for atoms: safe HTML rendering of note body content, and a new external dependency (`dompurify`) to handle it.

## Goals / Non-Goals

**Goals:**
- Implement NoteItem, NotesList, and NoteEditorModal as isolated, reusable React components.
- Define shared `Note` and `Category` TypeScript interfaces in `src/types/`.
- Sanitize HTML note body using `dompurify` before rendering with `dangerouslySetInnerHTML`.
- Expose Storybook stories for all three molecules.
- Keep molecules presentational: they receive data as props and emit callbacks; they own no network calls.

**Non-Goals:**
- Wiring to real API data — molecules accept mock data in stories and props from pages.
- Category filter logic — that belongs to the page layer.
- Playwright E2E tests — covered when pages are built.
- Rich text / WYSIWYG editor — plain text with basic list support only (textarea or contenteditable).

## Decisions

**Shared types in `src/types/index.ts`**
`Note` and `Category` interfaces are consumed by all three molecules. A single shared types file avoids duplication and keeps interfaces consistent with backend models. Alternative (co-locating types per component) would scatter the contract.

**`dompurify` for HTML sanitization**
NoteItem renders note body as HTML. `dangerouslySetInnerHTML` without sanitization is an XSS vector. `dompurify` is the standard client-side sanitizer; it's lightweight and tree-shakeable. Server-side-only alternatives (e.g., `sanitize-html`) would require wrapping in a Client Component boundary anyway — `dompurify` is already client-side by design.

**Dynamic border/background via inline style**
Both NoteItem and NoteEditorModal apply a hex color from the category at runtime. Tailwind JIT cannot generate arbitrary hex classes at build time, so `style={{ borderColor: color, backgroundColor: hexToRgba(color, 0.5) }}` is the only safe approach. A small `hexToRgba` utility handles the opacity conversion.

**CategoryDropdown as an internal sub-component of NoteEditorModal**
The dropdown is only used inside the modal and has no standalone story requirement. Keeping it as a private sub-component avoids premature promotion to atom while still being encapsulated.

**NoteEditorModal uses a controlled textarea**
Plain text + lists via a `<textarea>` keeps the implementation simple and avoids a heavy editor dependency. HTML list formatting can be handled at the API layer.

## Risks / Trade-offs

- [dompurify strips valid HTML on aggressive configs] → Use default config; note body HTML originates from our own backend, limiting attack surface.
- [Fixed pixel dimensions (303×246, 1199×700) may break on small screens] → Acceptable for now; responsive layout is a future concern outside this change's scope.
- [NoteEditorModal at 1199px is wider than most mobile screens] → Treated as a desktop-first modal; the page layer will control when/whether to show it.
