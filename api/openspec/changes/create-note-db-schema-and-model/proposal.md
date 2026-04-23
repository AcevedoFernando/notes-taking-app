## Why

The core value of the application is storing and retrieving notes. Without a `Note` model there is nothing to persist, search, or display. This change introduces the primary domain entity that the entire API surface will serve.

## What Changes

- Add `Note` Django model with a UUID PK, user FK, optional category FK, title, HTML-sanitized content, and a pinned flag
- Create and apply the database migration for the new `notes_note` table
- Register the model in Django admin
- Add `bleach` to `requirements.txt` for XSS sanitization of `content` at the model/service layer
- (No API endpoints yet — serializers and viewsets are a separate change)

## Capabilities

### New Capabilities

- `note-model`: Django ORM model representing a note, with UUID PK, `user` FK (CASCADE), `category` FK (nullable, SET_NULL), `title` (CharField 255), `content` (TextField, HTML-sanitized via bleach), and `is_pinned` (Boolean, default False)

### Modified Capabilities

<!-- None — this is the first Note model; no existing specs change -->

## Impact

- `notes/models.py` — new `Note` model alongside existing `Category`
- `notes/admin.py` — register `Note` with Django admin
- `notes/migrations/` — new migration creating `notes_note` table with FK to `notes_category` and `users_user`
- `requirements.txt` — add `bleach` for HTML sanitization
- No API surface changes; serializers/viewsets to be added in a later change
