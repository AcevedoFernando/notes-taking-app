## Why

The Notes Flow UI requires a set of foundational Atom components — Input, Button, and CategoryLabel — before any Molecules or Pages can be built. Without these primitives the design system has no reusable base, leaving every higher-level component to reinvent styling and behavior.

## What Changes

- Add `Input` atom: outlined text/password field with custom placeholder support and a password-visibility toggle icon.
- Add `Button` atom: outlined button with brand color `#957139`, optional leading icon, and a hover state at 20% opacity.
- Add `CategoryLabel` atom: inline-flex chip with a filled color circle and a category name label.
- Add Storybook stories for each atom.

## Capabilities

### New Capabilities

- `input-atom`: Outlined input component supporting text and password types, placeholder, and visibility toggle.
- `button-atom`: Outlined button component with optional leading icon and hover state.
- `category-label-atom`: Inline category chip displaying a color swatch and label text.

### Modified Capabilities

## Impact

- New files under `src/components/atoms/` (Input, Button, CategoryLabel).
- New Storybook stories under `src/stories/`.
- No API or routing changes.
- Downstream Molecules (NoteItem, NoteEditorModal, NotesList) depend on these atoms being available.
