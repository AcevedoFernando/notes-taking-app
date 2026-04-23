## ADDED Requirements

### Requirement: Custom User model exists and is the Django auth model
The system SHALL define a `User` model in the `users` app that extends Django's `AbstractUser`. Django's `AUTH_USER_MODEL` setting SHALL be set to `'users.User'` so all framework auth machinery references this model.

#### Scenario: User model is importable
- **WHEN** code imports `from users.models import User`
- **THEN** the import succeeds and `User` is a subclass of `AbstractUser`

#### Scenario: AUTH_USER_MODEL is configured
- **WHEN** Django settings are loaded
- **THEN** `settings.AUTH_USER_MODEL` equals `'users.User'`

### Requirement: Users app is registered
The `users` app SHALL be listed in `INSTALLED_APPS` so Django includes it in migrations and admin discovery.

#### Scenario: App is in INSTALLED_APPS
- **WHEN** Django initializes
- **THEN** `'users'` (or its AppConfig path) appears in `settings.INSTALLED_APPS`

### Requirement: Database migration exists for the User model
A Django migration SHALL exist in `users/migrations/` that creates the `users_user` table and all associated auth tables (groups, permissions) derived from `AbstractUser`.

#### Scenario: Migration applies cleanly on a fresh database
- **WHEN** `python manage.py migrate` is run against an empty database
- **THEN** the command exits successfully and the `users_user` table exists in the database

#### Scenario: No unapplied migrations after setup
- **WHEN** `python manage.py migrate` has been run
- **THEN** `python manage.py showmigrations users` shows all migrations as applied
