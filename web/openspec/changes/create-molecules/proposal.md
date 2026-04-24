## Why

With the Atom layer complete (Input, Button, CategoryLabel), the next tier in the Atomic Design hierarchy is Molecules. Without NoteItem, NotesList, and NoteEditorModal, no page can be assembled and the app has no visible UI beyond isolated primitives.

## What Changes

- Add `NoteItem` molecule: a 303×246 px card with dynamic border/background based on category color, HTML-safe note body, and metadata footer.
- Add `NotesList` molecule: a 3-column grid of NoteItems with an illustrated empty state.
- Add `NoteEditorModal` molecule: a 1199×700 px modal with a CategoryDropdown, plain-text editor, and dynamic category-matched styling.
- Add Storybook stories for each molecule.

## Capabilities

### New Capabilities

- `note-item`: Card component displaying a single note with category-driven color, title, content, and metadata.
- `notes-list`: Grid layout for a collection of NoteItem cards, including an empty-state illustration.
- `note-editor-modal`: Full-screen modal for creating/editing a note with a category selector and text editor.

### Modified Capabilities

## Impact

- New files under `src/components/molecules/` (NoteItem, NotesList, NoteEditorModal).
- New Storybook stories under `src/stories/`.
- Depends on atoms: `Button`, `CategoryLabel` (already built).
- Requires `Note` and `Category` TypeScript interfaces — will be defined in `src/types/`.
- HTML note content must be sanitized before render; `dompurify` or equivalent needed.
- No API or routing changes in this change.
