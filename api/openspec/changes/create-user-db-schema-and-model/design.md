## Context

The project is a Django 5.2 + DRF API backed by PostgreSQL 15. Currently there is a placeholder `notes` app with empty models. Django requires `AUTH_USER_MODEL` to be configured before any migration references users — so the custom user model must be created first, before any other domain models.

## Goals / Non-Goals

**Goals:**
- Create a `users` Django app with a custom `User` model extending `AbstractUser`
- Set `AUTH_USER_MODEL = 'users.User'` in `core/settings.py`
- Generate and apply the initial migration for the `users` app

**Non-Goals:**
- Authentication endpoints (login, registration, token issuance) — future change
- Email verification or social auth — future change
- Profile model or additional user fields beyond `AbstractUser` defaults — can be added later

## Decisions

### Extend `AbstractUser` rather than `AbstractBaseUser`

`AbstractUser` provides all standard Django fields (username, email, first_name, last_name, is_staff, is_active, date_joined, last_login) out of the box. `AbstractBaseUser` is lower-level and requires reimplementing the full manager and field set. Since we have no custom auth requirements at this stage, `AbstractUser` is the correct choice — it gives us a clean extension point with no extra work.

### Place the model in a dedicated `users` app (not inside `notes`)

Keeping the user model in its own app (`users/`) follows Django best practices and makes future extraction, testing, and reuse straightforward. The `notes` app will reference `settings.AUTH_USER_MODEL` for FKs, keeping coupling loose.

### Keep the model body empty for now

No extra fields are needed yet. The empty class body (`pass`) signals intentional inheritance from `AbstractUser` without customization. Adding fields later only requires a non-destructive migration.

## Risks / Trade-offs

- **Must be done before first migration on any other app** → If `notes` app generates migrations that reference `User` before this model exists, migrations will fail. Mitigation: create and apply the `users` migration before any FK references are added elsewhere.
- **Renaming or moving `AUTH_USER_MODEL` after initial migration is painful** → Django does not support changing `AUTH_USER_MODEL` after the first migration. Mitigation: this change establishes the permanent home (`users.User`) early.

## Migration Plan

1. Create `users/` app via `python manage.py startapp users` (or manually scaffold)
2. Define `User(AbstractUser)` in `users/models.py`
3. Add `'users'` to `INSTALLED_APPS` and set `AUTH_USER_MODEL = 'users.User'` in `core/settings.py`
4. Run `python manage.py makemigrations users`
5. Run `python manage.py migrate`

Rollback: drop the `users` app and revert settings before any other app migrates — straightforward at this stage.
