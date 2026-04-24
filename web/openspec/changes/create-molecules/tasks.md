## 1. Shared Foundation

- [x] 1.1 Install `dompurify` and `@types/dompurify` with pnpm
- [x] 1.2 Create `src/types/index.ts` with `Note` and `Category` interfaces
- [x] 1.3 Create `src/utils/hexToRgba.ts` utility for converting hex + opacity to `rgba()` string

## 2. NoteItem Molecule

- [x] 2.1 Create `src/components/molecules/NoteItem/NoteItem.tsx` with 303×246 px dimensions, dynamic border/background from `category.color`, shadow, and title/body/metadata layout
- [x] 2.2 Sanitize `note.content` with `dompurify` before rendering via `dangerouslySetInnerHTML`
- [x] 2.3 Create `src/components/molecules/NoteItem/index.ts` barrel export
- [x] 2.4 Create `src/stories/NoteItem.stories.tsx` with at least one realistic note and category

## 3. NotesList Molecule

- [x] 3.1 Create `src/components/molecules/NotesList/NotesList.tsx` with 3-column grid layout and NoteItem per note
- [x] 3.2 Implement empty state with `/public/images/coffee.png` image and waiting label
- [x] 3.3 Create `src/components/molecules/NotesList/index.ts` barrel export
- [x] 3.4 Create `src/stories/NotesList.stories.tsx` with Populated and Empty variants

## 4. NoteEditorModal Molecule

- [x] 4.1 Create `src/components/molecules/NoteEditorModal/NoteEditorModal.tsx` with full-viewport overlay, 1199×700 px dialog, 64px padding, and `isOpen` guard
- [x] 4.2 Implement dynamic border/background from selected category color (reuse `hexToRgba`)
- [x] 4.3 Implement internal `CategoryDropdown` sub-component (outlined, chevron icon, lists categories, calls `onCategoryChange`)
- [x] 4.4 Implement title `Input` atom and body `textarea` with `value`/`onChange` props
- [x] 4.5 Implement save `Button` atom calling `onSave`, and close handler calling `onClose` (also on Escape key)
- [x] 4.6 Create `src/components/molecules/NoteEditorModal/index.ts` barrel export
- [x] 4.7 Create `src/stories/NoteEditorModal.stories.tsx` showing the open modal with a pre-selected category

## 5. Molecules Index

- [x] 5.1 Create `src/components/molecules/index.ts` re-exporting NoteItem, NotesList, and NoteEditorModal
