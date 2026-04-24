## ADDED Requirements

### Requirement: NoteItem renders a sized card with category-driven color
The NoteItem component SHALL render a card of 303×246 px with 11px border radius, a 3px solid border using `category.color`, and a background of `category.color` at 50% opacity. It SHALL accept a `note` prop matching the `Note` interface and a `category` prop matching the `Category` interface.

#### Scenario: Card renders with category color
- **WHEN** NoteItem is rendered with a note and a category with `color="#4CAF50"`
- **THEN** the card border is `#4CAF50` and the background is `#4CAF50` at 50% opacity

#### Scenario: Card has correct dimensions and radius
- **WHEN** NoteItem is rendered
- **THEN** the card is 303px wide, 246px tall, and has 11px border radius

### Requirement: NoteItem applies a drop shadow
The NoteItem component SHALL apply a box shadow of `1px 1px 2px 0px #00000040`.

#### Scenario: Shadow is present
- **WHEN** NoteItem is rendered
- **THEN** the card has the specified box shadow

### Requirement: NoteItem displays title, body, date, and category name
The NoteItem component SHALL render the note title in `Inria Serif` 24px bold, the note body as sanitized HTML, the `updated_at` date in `Inter` 12px bold, and the `category_name` in `Inter` 12px regular.

#### Scenario: Title is displayed in correct font
- **WHEN** NoteItem renders with `note.title = "My Note"`
- **THEN** the title "My Note" appears in Inria Serif 24px bold

#### Scenario: Body HTML is sanitized before render
- **WHEN** NoteItem receives a `note.content` containing an `<script>` tag
- **THEN** the script tag is stripped from the rendered output

#### Scenario: Metadata is displayed
- **WHEN** NoteItem renders with `note.updated_at` and `category.name`
- **THEN** both the formatted date and category name appear in the card footer

### Requirement: NoteItem exposes a Storybook story
The NoteItem component SHALL have a Storybook story with at least one realistic note and category.

#### Scenario: Story renders without errors
- **WHEN** Storybook loads the NoteItem story
- **THEN** the card renders without console errors
