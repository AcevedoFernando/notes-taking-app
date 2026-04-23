## Why

The notes app currently has empty scaffolding with no API endpoints. Users cannot create, read, update, or delete notes through the API, making the core feature of the application non-functional. This change implements all CRUD endpoints for notes so the frontend can interact with the API.

## What Changes

- Add `GET /api/notes/` — list all notes for the authenticated user (with optional filters: category, pinned status, search)
- Add `POST /api/notes/` — create a new note
- Add `GET /api/notes/<id>/` — retrieve a single note
- Add `PUT /api/notes/<id>/` — fully update a note
- Add `PATCH /api/notes/<id>/` — partially update a note (e.g., toggle pin, update title only)
- Add `DELETE /api/notes/<id>/` — delete a note
- Add `notes/urls.py` and wire it into `core/urls.py`
- Add `NoteSerializer` with HTML sanitization on `content` field
- Add service layer functions in `notes/services.py` for all note operations
- Enforce IDOR protection: users can only access their own notes

## Capabilities

### New Capabilities

- `notes-crud`: Full CRUD API for notes — list, create, retrieve, update, patch, delete — with ownership enforcement and content sanitization

### Modified Capabilities

<!-- No existing specs require requirement changes -->

## Impact

- **New files**: `notes/urls.py`, `notes/serializers.py`, `notes/services.py`, `notes/views.py` (currently empty)
- **Modified files**: `core/urls.py` (add notes URL include), `notes/models.py` (confirm Note model fields)
- **Dependencies**: `bleach` for HTML sanitization on note content
- **APIs**: Exposes 6 new REST endpoints under `/api/notes/`
- **Security**: All endpoints require authentication; IDOR protection ensures users only access their own notes
