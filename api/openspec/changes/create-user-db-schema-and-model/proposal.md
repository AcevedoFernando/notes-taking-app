## Why

The notes-taking app needs a User model to associate notes with their owners, enable authentication, and support per-user data isolation. Without it, no access control or personalization is possible.

## What Changes

- Add a custom `User` model to the Django project extending `AbstractUser`
- Configure Django to use the custom user model as `AUTH_USER_MODEL`
- Create and apply the initial database migration for the `users` app
- Add `users` app to `INSTALLED_APPS`

## Capabilities

### New Capabilities
- `user-model`: Custom Django user model with standard auth fields (email, username, timestamps) as the foundation for authentication and note ownership

### Modified Capabilities
<!-- No existing specs to modify -->

## Impact

- **New app**: `users/` Django app with `User` model
- **Settings**: `AUTH_USER_MODEL = 'users.User'` must be set before any other models reference users
- **Database**: New `users_user` table (and related auth tables) created via migration
- **Dependencies**: No new packages needed — uses Django's built-in `AbstractUser`
- **Future**: All future models (e.g., `Note`) will have a FK to this user model
