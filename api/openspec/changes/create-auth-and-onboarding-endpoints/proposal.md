## Why

The API has no entry point — users cannot register, receive a token, or authenticate. Without auth, every downstream endpoint (notes, categories) is inaccessible or unprotected. This change introduces registration with automatic onboarding and JWT-based login as the foundation for all other authenticated flows.

## What Changes

- Add `POST /api/auth/register/` — creates a user and atomically provisions 4 default categories, returns a JWT access + refresh token pair
- Add `POST /api/auth/token/` — JWT login (email + password → access + refresh tokens) via `djangorestframework-simplejwt`
- Add `POST /api/auth/token/refresh/` — JWT refresh via `djangorestframework-simplejwt`
- Add `POST /api/auth/token/revoke/` — blacklists a refresh token, preventing further use; requires `rest_framework_simplejwt.token_blacklist` app + migration
- Add `users/serializers.py` with `RegisterSerializer` (validates email uniqueness, password strength)
- Add `users/views.py` with `RegisterView`
- Add `users/urls.py` and wire into `core/urls.py` under `api/auth/`
- Add `api/services/onboarding.py` with `create_default_categories()` wrapped in a DB transaction
- Extend `users/models.py` — add `id` (UUID4 PK) and `email` (unique, indexed) to the custom `User` model; remove unused `username` field
- Add `djangorestframework-simplejwt` and `drf-spectacular` to `requirements.txt`
- Add `core/exception_handler.py` — unified error response structure
- Update `core/settings.py` — configure JWT auth, drf-spectacular, custom exception handler, `ATOMIC_REQUESTS = True`

## Capabilities

### New Capabilities

- `user-registration`: `POST /api/auth/register/` validates input, creates a User with a UUID PK and email-based identity, atomically provisions 4 default categories, and returns JWT tokens
- `jwt-login`: `POST /api/auth/token/`, `POST /api/auth/token/refresh/`, and `POST /api/auth/token/revoke/` provide JWT authentication, refresh, and explicit token invalidation via `djangorestframework-simplejwt`
- `onboarding-service`: `api/services/onboarding.py` encapsulates default-category creation logic inside a DB transaction; reusable across views
- `unified-error-response`: custom DRF exception handler returning `{"error": "...", "message": "...", "fields": {...}}` for all 4xx/5xx responses

### Modified Capabilities

<!-- None — all capabilities are new -->

## Impact

- `users/models.py` — replace `AbstractUser` with a UUID-PK, email-login model (removes `username` as login field)
- `users/serializers.py`, `users/views.py`, `users/urls.py` — new files
- `api/services/` — new directory and `onboarding.py` module
- `core/urls.py` — add `path('api/auth/', include('users.urls'))` including `token/revoke/` URL
- `core/settings.py` — add `rest_framework_simplejwt.token_blacklist` to `INSTALLED_APPS`
- `core/settings.py` — JWT settings, drf-spectacular, custom exception handler, `ATOMIC_REQUESTS = True`
- `core/exception_handler.py` — new file
- `requirements.txt` — add `djangorestframework-simplejwt`, `drf-spectacular`
- **Breaking:** `users/migrations/` — new migration altering `User` (UUID PK, email login); wipes existing user rows if any exist in dev
