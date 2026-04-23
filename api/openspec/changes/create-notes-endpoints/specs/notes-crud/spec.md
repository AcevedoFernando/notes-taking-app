## ADDED Requirements

### Requirement: List notes
The system SHALL return all notes belonging to the authenticated user, ordered by `is_pinned` descending then `created_at` descending. The response SHALL support optional query parameters: `category` (integer ID), `is_pinned` (boolean), and `search` (substring match on title or content).

#### Scenario: List all notes for authenticated user
- **WHEN** an authenticated user sends `GET /api/notes/`
- **THEN** the system returns HTTP 200 with a JSON array of notes owned by that user only

#### Scenario: Filter by category
- **WHEN** an authenticated user sends `GET /api/notes/?category=3`
- **THEN** the system returns only notes whose `category_id` equals 3 and that belong to the user

#### Scenario: Filter by pinned status
- **WHEN** an authenticated user sends `GET /api/notes/?is_pinned=true`
- **THEN** the system returns only notes where `is_pinned` is `true`

#### Scenario: Search by title or content
- **WHEN** an authenticated user sends `GET /api/notes/?search=django`
- **THEN** the system returns notes whose `title` or `content` contains "django" (case-insensitive)

#### Scenario: Unauthenticated list request
- **WHEN** a request is sent to `GET /api/notes/` without a valid JWT
- **THEN** the system returns HTTP 401

### Requirement: Create note
The system SHALL create a new note for the authenticated user. The `title` field is required. The `content` field is optional and SHALL be sanitized with bleach before storage. The `category` field is optional; if provided, it MUST belong to the authenticated user.

#### Scenario: Successful note creation
- **WHEN** an authenticated user sends `POST /api/notes/` with `{"title": "My note", "content": "<b>Hello</b>"}`
- **THEN** the system returns HTTP 201 with the created note including its UUID and sanitized content

#### Scenario: Missing title
- **WHEN** an authenticated user sends `POST /api/notes/` with no `title`
- **THEN** the system returns HTTP 400 with `{"error": "VALIDATION_ERROR", "fields": {"title": [...]}}`

#### Scenario: XSS content is sanitized
- **WHEN** an authenticated user sends `POST /api/notes/` with `{"title": "t", "content": "<script>alert(1)</script>"}`
- **THEN** the system stores and returns the content with the `<script>` tag stripped

#### Scenario: Category belongs to another user
- **WHEN** an authenticated user sends `POST /api/notes/` with a `category` ID owned by a different user
- **THEN** the system returns HTTP 400 with a validation error on the `category` field

### Requirement: Retrieve note
The system SHALL return the full detail of a single note by its UUID, only if the note belongs to the authenticated user.

#### Scenario: Successful retrieval
- **WHEN** an authenticated user sends `GET /api/notes/<uuid>/` for a note they own
- **THEN** the system returns HTTP 200 with the full note object

#### Scenario: Note belongs to another user
- **WHEN** an authenticated user sends `GET /api/notes/<uuid>/` for a note owned by someone else
- **THEN** the system returns HTTP 404

#### Scenario: Note does not exist
- **WHEN** an authenticated user sends `GET /api/notes/<non-existent-uuid>/`
- **THEN** the system returns HTTP 404

### Requirement: Update note
The system SHALL fully replace a note's fields when the authenticated user sends a PUT request. All writable fields (`title`, `content`, `category`, `is_pinned`) MUST be provided.

#### Scenario: Successful full update
- **WHEN** an authenticated user sends `PUT /api/notes/<uuid>/` with all required fields
- **THEN** the system returns HTTP 200 with the updated note

#### Scenario: PUT on another user's note
- **WHEN** an authenticated user sends `PUT /api/notes/<uuid>/` for a note they do not own
- **THEN** the system returns HTTP 404

### Requirement: Partial update note
The system SHALL partially update a note when the authenticated user sends a PATCH request. Only provided fields are updated; unspecified fields retain their current values.

#### Scenario: Toggle pin status
- **WHEN** an authenticated user sends `PATCH /api/notes/<uuid>/` with `{"is_pinned": true}`
- **THEN** the system returns HTTP 200 with `is_pinned` set to `true` and other fields unchanged

#### Scenario: Update title only
- **WHEN** an authenticated user sends `PATCH /api/notes/<uuid>/` with `{"title": "New Title"}`
- **THEN** the system returns HTTP 200 with the new title and all other fields unchanged

#### Scenario: PATCH on another user's note
- **WHEN** an authenticated user sends `PATCH /api/notes/<uuid>/` for a note they do not own
- **THEN** the system returns HTTP 404

### Requirement: Delete note
The system SHALL permanently delete a note when the authenticated user sends a DELETE request, only if the note belongs to that user.

#### Scenario: Successful deletion
- **WHEN** an authenticated user sends `DELETE /api/notes/<uuid>/` for a note they own
- **THEN** the system returns HTTP 204 and the note no longer exists in the database

#### Scenario: DELETE on another user's note
- **WHEN** an authenticated user sends `DELETE /api/notes/<uuid>/` for a note they do not own
- **THEN** the system returns HTTP 404

#### Scenario: Subsequent retrieval after deletion
- **WHEN** an authenticated user deletes a note and then sends `GET /api/notes/<uuid>/`
- **THEN** the system returns HTTP 404
