## ADDED Requirements

### Requirement: NotesList renders notes in a 3-column grid
The NotesList component SHALL render a grid of NoteItem cards with 3 columns and a vertical (column-first) flow. It SHALL accept a `notes` prop of type `Note[]` and a `categories` prop of type `Category[]`.

#### Scenario: Grid shows 3 columns
- **WHEN** NotesList is rendered with 6 notes
- **THEN** notes appear in a 3-column layout

#### Scenario: Each note renders as a NoteItem
- **WHEN** NotesList is rendered with a non-empty notes array
- **THEN** one NoteItem card is visible per note

### Requirement: NotesList shows an empty state when there are no notes
The NotesList component SHALL render an empty state when `notes` is an empty array. The empty state SHALL display the image `/public/images/coffee.png` and the label "I'm just here waiting for your charming notes…" in the brand heading color `#88642A`.

#### Scenario: Empty state appears with no notes
- **WHEN** NotesList is rendered with `notes={[]}`
- **THEN** the coffee image and the waiting label are visible and no NoteItem cards are shown

#### Scenario: Empty state disappears when notes exist
- **WHEN** NotesList is rendered with at least one note
- **THEN** NoteItem cards are shown and the empty state image is not rendered

### Requirement: NotesList exposes Storybook stories for populated and empty states
The NotesList component SHALL have Storybook stories for both a populated grid and an empty state.

#### Scenario: Stories render without errors
- **WHEN** Storybook loads the NotesList stories
- **THEN** both the Populated and Empty stories render without console errors
