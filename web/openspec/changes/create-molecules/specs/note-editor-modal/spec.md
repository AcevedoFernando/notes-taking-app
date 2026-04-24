## ADDED Requirements

### Requirement: NoteEditorModal renders as a full-overlay modal
The NoteEditorModal component SHALL render as an overlay covering the full viewport with a centered dialog of 1199×700 px and 64px interior padding. It SHALL accept an `isOpen` boolean prop; when `false` the modal SHALL not be rendered to the DOM.

#### Scenario: Modal is visible when open
- **WHEN** NoteEditorModal is rendered with `isOpen={true}`
- **THEN** the dialog is visible at 1199×700 px with a full-viewport overlay behind it

#### Scenario: Modal is hidden when closed
- **WHEN** NoteEditorModal is rendered with `isOpen={false}`
- **THEN** no modal content is present in the DOM

### Requirement: NoteEditorModal applies category-driven color matching NoteItem
The NoteEditorModal dialog SHALL apply the selected category's color as a 3px solid border and a background at 50% opacity, identical to NoteItem styling.

#### Scenario: Modal color reflects selected category
- **WHEN** a category with `color="#957139"` is selected
- **THEN** the modal dialog border is `#957139` and background is `#957139` at 50% opacity

### Requirement: NoteEditorModal includes a CategoryDropdown
The NoteEditorModal SHALL render an outlined dropdown with a chevron icon allowing the user to select a category. The dropdown SHALL accept `categories: Category[]` and call `onCategoryChange(category: Category)` when a selection is made.

#### Scenario: Dropdown lists all categories
- **WHEN** the user opens the CategoryDropdown inside the modal
- **THEN** all provided categories are listed as selectable options

#### Scenario: Selecting a category triggers callback
- **WHEN** the user selects a category from the dropdown
- **THEN** `onCategoryChange` is called with the selected category

### Requirement: NoteEditorModal includes a plain-text editor
The NoteEditorModal SHALL render a textarea (or contenteditable) for the note body that supports plain text and basic list input. It SHALL accept `value: string` and `onChange(value: string)` props.

#### Scenario: Editor accepts text input
- **WHEN** the user types in the note body area
- **THEN** `onChange` is called with the updated text value

### Requirement: NoteEditorModal provides a title input and a close/save action
The NoteEditorModal SHALL include an input for the note title and a save button (using the Button atom) and a way to dismiss the modal (calling `onClose`).

#### Scenario: Save button triggers onSave
- **WHEN** the user clicks the save button
- **THEN** `onSave` is called with the current title and content values

#### Scenario: Closing the modal calls onClose
- **WHEN** the user dismisses the modal (e.g., clicks close or presses Escape)
- **THEN** `onClose` is called

### Requirement: NoteEditorModal exposes a Storybook story
The NoteEditorModal component SHALL have a Storybook story showing the open modal with a pre-selected category.

#### Scenario: Story renders without errors
- **WHEN** Storybook loads the NoteEditorModal story
- **THEN** the modal renders without console errors
