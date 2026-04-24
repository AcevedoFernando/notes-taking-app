## ADDED Requirements

### Requirement: Home page renders a two-column layout at /home
The `/home` route SHALL render a two-column layout: a sidebar occupying 25% of the width and a main content area occupying 75%, on the brand background `#FAF1E3`.

#### Scenario: Two-column layout is present
- **WHEN** the user navigates to `/home`
- **THEN** a sidebar and a main content area are visible side by side

### Requirement: Sidebar contains a New Note button
The sidebar SHALL render a Button atom labeled "New Note" with a Plus icon. Clicking it SHALL open the NoteEditorModal.

#### Scenario: New Note button opens the editor modal
- **WHEN** the user clicks the "New Note" button in the sidebar
- **THEN** the NoteEditorModal is rendered and visible

### Requirement: Sidebar contains a CategoryFilters list
The sidebar SHALL render a list of categories. Each category item SHALL display a CategoryLabel atom. The active/selected category SHALL be visually highlighted. Clicking a category SHALL filter the notes shown in the main content area.

#### Scenario: Category list is displayed
- **WHEN** the user is on `/home`
- **THEN** all available categories are listed in the sidebar

#### Scenario: Clicking a category filters the notes
- **WHEN** the user clicks a category in the sidebar
- **THEN** only notes belonging to that category are shown in the main content area

#### Scenario: An "All" option shows all notes
- **WHEN** the user selects "All" in the category filter
- **THEN** all notes are shown regardless of category

### Requirement: Main content area displays the NotesList molecule
The main content area SHALL render the NotesList molecule with the currently filtered set of notes and all categories.

#### Scenario: Notes are displayed in a 3-column grid
- **WHEN** the user is on `/home` with notes available
- **THEN** note cards appear in a 3-column grid in the main content area

#### Scenario: Empty state is shown when no notes match the filter
- **WHEN** the active category filter has no matching notes
- **THEN** the NotesList empty state (coffee image + label) is shown

### Requirement: NoteEditorModal can be closed from /home
The NoteEditorModal on `/home` SHALL close when the user clicks the close button or presses Escape, returning focus to the dashboard.

#### Scenario: Closing the modal returns to dashboard view
- **WHEN** the user closes the NoteEditorModal
- **THEN** the modal is no longer visible and the dashboard is shown
