## ADDED Requirements

### Requirement: List categories
The system SHALL return all categories belonging to the authenticated user, ordered by `id` ascending.

#### Scenario: List all categories for authenticated user
- **WHEN** an authenticated user sends `GET /api/categories/`
- **THEN** the system returns HTTP 200 with a JSON array of categories owned by that user only

#### Scenario: Categories from other users are not included
- **WHEN** two users each have categories and one sends `GET /api/categories/`
- **THEN** the response contains only that user's categories

#### Scenario: Unauthenticated list request
- **WHEN** a request is sent to `GET /api/categories/` without a valid JWT
- **THEN** the system returns HTTP 401

### Requirement: Create category
The system SHALL create a new category for the authenticated user. Both `name` (max 100 chars) and `color` (7-char hex string, e.g. `#AABBCC`) are required. The `name` MUST be unique per user.

#### Scenario: Successful category creation
- **WHEN** an authenticated user sends `POST /api/categories/` with `{"name": "Work", "color": "#FF5733"}`
- **THEN** the system returns HTTP 201 with the created category including its `id`

#### Scenario: Missing name returns 400
- **WHEN** an authenticated user sends `POST /api/categories/` with no `name`
- **THEN** the system returns HTTP 400 with `{"error": "VALIDATION_ERROR", "fields": {"name": [...]}}`

#### Scenario: Missing color returns 400
- **WHEN** an authenticated user sends `POST /api/categories/` with no `color`
- **THEN** the system returns HTTP 400 with `{"error": "VALIDATION_ERROR", "fields": {"color": [...]}}`

#### Scenario: Duplicate name for same user returns 400
- **WHEN** an authenticated user creates a category named "Work" and then sends `POST /api/categories/` with the same name
- **THEN** the system returns HTTP 400 with `{"error": "VALIDATION_ERROR", "fields": {"name": [...]}}`

#### Scenario: Same name for different users is allowed
- **WHEN** two different users each create a category with the same name
- **THEN** both requests return HTTP 201

#### Scenario: Unauthenticated create request
- **WHEN** a request is sent to `POST /api/categories/` without a valid JWT
- **THEN** the system returns HTTP 401

### Requirement: Retrieve category
The system SHALL return the full detail of a single category by its integer `id`, only if the category belongs to the authenticated user.

#### Scenario: Successful retrieval
- **WHEN** an authenticated user sends `GET /api/categories/<id>/` for a category they own
- **THEN** the system returns HTTP 200 with the full category object

#### Scenario: Category belongs to another user
- **WHEN** an authenticated user sends `GET /api/categories/<id>/` for a category owned by someone else
- **THEN** the system returns HTTP 404

#### Scenario: Category does not exist
- **WHEN** an authenticated user sends `GET /api/categories/99999/`
- **THEN** the system returns HTTP 404

### Requirement: Update category
The system SHALL fully replace a category's fields when the authenticated user sends a PUT request. Both `name` and `color` MUST be provided. The new `name` MUST still be unique for that user (excluding the current instance).

#### Scenario: Successful full update
- **WHEN** an authenticated user sends `PUT /api/categories/<id>/` with `{"name": "Renamed", "color": "#000000"}`
- **THEN** the system returns HTTP 200 with the updated category

#### Scenario: PUT on another user's category returns 404
- **WHEN** an authenticated user sends `PUT /api/categories/<id>/` for a category they do not own
- **THEN** the system returns HTTP 404

#### Scenario: Renaming to a name already used by same user returns 400
- **WHEN** an authenticated user tries to rename a category to a name already used by one of their other categories
- **THEN** the system returns HTTP 400 with a validation error on `name`

### Requirement: Partial update category
The system SHALL partially update a category when the authenticated user sends a PATCH request. Only provided fields are updated.

#### Scenario: Update color only
- **WHEN** an authenticated user sends `PATCH /api/categories/<id>/` with `{"color": "#123456"}`
- **THEN** the system returns HTTP 200 with the new color and `name` unchanged

#### Scenario: PATCH on another user's category returns 404
- **WHEN** an authenticated user sends `PATCH /api/categories/<id>/` for a category they do not own
- **THEN** the system returns HTTP 404

### Requirement: Delete category
The system SHALL permanently delete a category when the authenticated user sends a DELETE request, only if the category belongs to that user. Notes referencing the deleted category SHALL have their `category` field set to null.

#### Scenario: Successful deletion
- **WHEN** an authenticated user sends `DELETE /api/categories/<id>/` for a category they own
- **THEN** the system returns HTTP 204 and the category no longer exists

#### Scenario: Notes are nullified after category deletion
- **WHEN** a category is deleted
- **THEN** notes that referenced that category now have `category` set to null

#### Scenario: DELETE on another user's category returns 404
- **WHEN** an authenticated user sends `DELETE /api/categories/<id>/` for a category they do not own
- **THEN** the system returns HTTP 404
