## ADDED Requirements

### Requirement: Note has a UUID primary key
The system SHALL use `uuid.uuid4` as the default for the `id` field of `Note`, making it a UUID4 primary key instead of an auto-incrementing integer.

#### Scenario: PK is a UUID on creation
- **WHEN** a new `Note` is created without specifying `id`
- **THEN** `note.id` is a valid UUID4 string assigned automatically

### Requirement: Note belongs to a user
The system SHALL require each `Note` to be associated with exactly one `User` via a non-nullable ForeignKey with `on_delete=CASCADE`. Deleting the user SHALL cascade-delete all their notes.

#### Scenario: Create note owned by a user
- **WHEN** a `Note` is saved with a valid `user` FK
- **THEN** the record is persisted and `note.user` returns the correct user

#### Scenario: Cascade delete on user removal
- **WHEN** the owning `User` is deleted
- **THEN** all their `Note` rows are also deleted

### Requirement: Note has an optional category
The system SHALL allow a `Note` to be linked to a `Category` via a nullable ForeignKey with `on_delete=SET_NULL`. Deleting a `Category` SHALL set `note.category` to `NULL` rather than deleting the note.

#### Scenario: Create note without a category
- **WHEN** a `Note` is saved without a `category`
- **THEN** the record is persisted with `category` as `NULL`

#### Scenario: Create note with a category
- **WHEN** a `Note` is saved with a valid `category` FK
- **THEN** `note.category` returns the linked `Category`

#### Scenario: Deleting category nullifies note's category
- **WHEN** the linked `Category` is deleted
- **THEN** the `Note` still exists with `category` set to `NULL`

### Requirement: Note has a title
The system SHALL require each `Note` to have a non-empty `title` of at most 255 characters.

#### Scenario: Create note with a title
- **WHEN** a `Note` is saved with a `title` of 1–255 characters
- **THEN** the record is persisted with the provided title

### Requirement: Note content is stored as text
The system SHALL store `Note.content` as an unrestricted `TextField`. HTML sanitization SHALL be applied at the service layer before the value reaches the model.

#### Scenario: Content is persisted as-is at the model level
- **WHEN** a `Note` is saved with a `content` value
- **THEN** the record is persisted with that exact value

### Requirement: Note has an is_pinned flag
The system SHALL include an `is_pinned` boolean field on `Note` that defaults to `False`. A pinned note is one the user has marked for quick access.

#### Scenario: is_pinned defaults to False
- **WHEN** a `Note` is created without specifying `is_pinned`
- **THEN** `note.is_pinned` is `False`

#### Scenario: Note can be pinned
- **WHEN** a `Note` is saved with `is_pinned=True`
- **THEN** `note.is_pinned` is `True`
