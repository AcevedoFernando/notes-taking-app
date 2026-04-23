## ADDED Requirements

### Requirement: Category has a user-scoped unique name
The system SHALL enforce that each `Category` instance has a non-empty `name` (max 100 characters) that is unique **per user** — two different users MAY have categories with the same name, but a single user MAY NOT have two categories with the same name.

#### Scenario: Create category with a name unique to that user
- **WHEN** a `Category` is saved with a `name` not already used by the same `user`
- **THEN** the record is persisted successfully

#### Scenario: Reject duplicate name for the same user
- **WHEN** a `Category` is saved with a `name` that the same `user` already owns
- **THEN** an `IntegrityError` is raised and no new record is created

#### Scenario: Allow same name for different users
- **WHEN** two different `User` instances each save a `Category` with the same `name`
- **THEN** both records are persisted successfully

### Requirement: Category has a hex color
The system SHALL require each `Category` to have a `color` value stored as a 7-character string (e.g. `#EF9C66`).

#### Scenario: Create category with a valid color
- **WHEN** a `Category` is saved with a `color` of exactly 7 characters
- **THEN** the record is persisted with the provided color value

### Requirement: Category belongs to a user
The system SHALL require each `Category` to be associated with exactly one `User` via a non-nullable ForeignKey. Deleting a user SHALL cascade-delete all their categories.

#### Scenario: Create category owned by a user
- **WHEN** a `Category` is saved with a valid `user` FK
- **THEN** the record is persisted and `category.user` returns the correct user

#### Scenario: Cascade delete on user removal
- **WHEN** the owning `User` is deleted
- **THEN** all their `Category` rows are also deleted

### Requirement: Category PK is an integer AutoField
The system SHALL use Django's default `AutoField` (integer) as the primary key for `Category`, consistent with `CONTEXT.md` (UUID PKs apply only to `User` and `Note`).

#### Scenario: PK is auto-assigned on creation
- **WHEN** a new `Category` is created without specifying `id`
- **THEN** `category.id` is a positive integer assigned by the database
