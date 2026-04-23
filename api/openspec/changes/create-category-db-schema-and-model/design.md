## Context

The `notes` Django app already contains scaffolding (`models.py`, `admin.py`, `migrations/`). PostgreSQL is configured and `notes` is in `INSTALLED_APPS`. The domain model in `CONTEXT.md` defines `Category` as user-owned, so this change must land after (or alongside) the `User` model. Both models live in the same `notes` app.

## Goals / Non-Goals

**Goals:**
- Define the `Category` model matching the domain model in `CONTEXT.md`: `id` (AutoField), `name` (CharField 100), `color` (CharField 7, hex), `user` (ForeignKey to User), `unique_together = ('name', 'user')`
- Generate and apply the migration for the `notes_category` table
- Register `Category` in Django admin

**Non-Goals:**
- Nested/hierarchical categories
- REST API endpoints for categories (separate change)
- Linking `Category` to `Note` via FK (separate change)

## Decisions

**`id` is an AutoField (integer PK), not UUID**
Per `CONTEXT.md`, UUID PKs apply to `User` and `Note` only. `Category` uses Django's default `AutoField`. This avoids unnecessary UUID overhead for a lookup table that is always accessed through its owner user.

**`name` uniqueness is per-user (`unique_together`), not global**
`CONTEXT.md` specifies `unique_together = ('name', 'user')`. This allows two different users to both have a "Personal" category. A global `unique=True` on `name` would be incorrect and would break the onboarding flow (all new users get the same four default category names).

**`color` is `CharField(7)` storing a hex code (e.g. `#EF9C66`)**
Per `CONTEXT.md`. Length 7 accommodates the `#` prefix plus six hex digits. Validation of the hex format is left to the serializer layer (separate change); the model only enforces the length.

**`user` ForeignKey with `on_delete=CASCADE`**
When a user is deleted, their categories should be deleted too — there is no business reason to orphan category rows. `related_name='categories'` matches `CONTEXT.md`.

**Placed in the `notes` app, not a separate `categories` app**
Categories exist solely to organize notes. Splitting into a separate Django app adds indirection with no benefit at this scale.

**No `description` field**
The domain model in `CONTEXT.md` does not include a description. Adding one would be scope creep.

## Risks / Trade-offs

- **Dependency on User model** → This migration must run after the User migration. If a custom User model is introduced later, the FK target may need updating. Mitigation: reference `settings.AUTH_USER_MODEL` instead of a hard import.
- **Hex format not enforced at DB level** → Invalid color values could be stored. Mitigation: enforce via DRF serializer `validate_color` in the API change.

## Migration Plan

1. Ensure User model (and its migration) exists first
2. Run `docker compose run --rm api python manage.py makemigrations notes` to generate the migration
3. Run `docker compose run --rm api python manage.py migrate` to apply — creates `notes_category` table with the `unique_together` constraint
4. Rollback: `docker compose run --rm api python manage.py migrate notes <previous>` drops the table cleanly
