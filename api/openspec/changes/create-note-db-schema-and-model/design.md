## Context

The `notes` Django app already contains the `Category` model (from the `create-category-db-schema-and-model` change) and its migration. `Note` is the central domain entity — every future endpoint, search, and permission check revolves around it. This change adds `Note` alongside `Category` in the same app, establishes the two FKs, and wires in `bleach` for content sanitization.

## Goals / Non-Goals

**Goals:**
- Define the `Note` model matching the domain model in `CONTEXT.md`: `id` (UUID4 PK), `user` (ForeignKey, CASCADE), `category` (ForeignKey, nullable, SET_NULL), `title` (CharField 255), `content` (TextField, HTML-sanitized), `is_pinned` (Boolean, default False)
- Generate and apply the migration for the `notes_note` table
- Add `bleach` to `requirements.txt`
- Register `Note` in Django admin

**Non-Goals:**
- REST API endpoints (separate change)
- Note serializers or ViewSets
- Full-text search indexing
- Soft delete / archiving

## Decisions

**`id` is a UUID4 field, not AutoField**
Per `CONTEXT.md`, `User` and `Note` use UUID4 PKs. This prevents enumeration attacks (sequential IDs leak record counts), supports distributed generation, and keeps the PK stable if records are ever migrated between environments.

**`category` FK is nullable (`null=True`, `on_delete=SET_NULL`)**
A note does not require a category. Deleting a category should not cascade-delete all associated notes — it should only unlink them (SET_NULL). This is the safest default for user data and matches `CONTEXT.md`.

**`user` FK uses `on_delete=CASCADE`**
When a user is deleted, their notes should be deleted too. There is no business reason to keep orphaned notes. `related_name='notes'` matches `CONTEXT.md`.

**HTML sanitization via `bleach` at the service layer, not on the model**
The model stores the sanitized value — `bleach.clean()` is called in the service layer (not in `save()`) so that: (a) the model remains a plain data container, (b) sanitization can be tested independently, and (c) the admin can store raw HTML if needed for seed data. The model field is a plain `TextField`.

**`is_pinned` defaults to `False` at the DB level**
Using `default=False` (not `null=True`) keeps the column semantically clean — a note is either pinned or not, never unknown.

**Both FKs reference `settings.AUTH_USER_MODEL` and `notes.Category` respectively**
`settings.AUTH_USER_MODEL` avoids a hard import of the User model and is the Django-recommended pattern. `Category` is in the same app, so a direct model import is fine.

## Risks / Trade-offs

- **UUID PK performance** → UUID4 random values cause B-tree index fragmentation over time. Mitigation: acceptable at this scale; can migrate to UUID7 (time-ordered) or `ulid` later if needed.
- **Sanitization at the service layer** → Raw HTML could be stored if a value is set directly on the model (e.g., in tests or shell). Mitigation: document that all writes to `content` must go through the service; add a test asserting sanitization occurs.
- **No timestamps on Note** → `CONTEXT.md` does not list timestamps for `Note`. They are omitted to stay faithful to the spec; can be added in a later change if needed.

## Migration Plan

1. Ensure `notes/migrations/0001_initial.py` (Category) exists — it does after the previous change
2. Run `docker compose run --rm api python manage.py makemigrations notes` to generate `0002_note.py`
3. Run `docker compose run --rm api python manage.py migrate` to apply — creates `notes_note` table
4. Rollback: `docker compose run --rm api python manage.py migrate notes 0001` reverts to Category-only state
