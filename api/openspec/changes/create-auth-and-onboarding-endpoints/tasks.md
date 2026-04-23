## 1. Dependencies

- [x] 1.1 Add `djangorestframework-simplejwt` and `drf-spectacular` to `requirements.txt`

## 2. User Model Rewrite

- [x] 2.1 Rewrite `users/models.py`: replace `AbstractUser` stub with a full custom user model — `id` (UUID4 PK), `email` (EmailField, unique, db_index=True), `password` (inherited), `USERNAME_FIELD = 'email'`, `REQUIRED_FIELDS = []`, no `username` field
- [x] 2.2 Delete `users/migrations/` content and regenerate: `docker compose run --rm api python manage.py makemigrations users`
- [x] 2.3 Delete `notes/migrations/0001_initial.py` and `0002_note.py` and regenerate: `docker compose run --rm api python manage.py makemigrations notes`
- [x] 2.4 Reset the database and apply all migrations clean: `docker compose run --rm api python manage.py migrate`

## 3. Settings

- [x] 3.1 Add `ATOMIC_REQUESTS = True` to `core/settings.py`
- [x] 3.2 Add `REST_FRAMEWORK` settings: `DEFAULT_AUTHENTICATION_CLASSES` → `JWTAuthentication`, `DEFAULT_PERMISSION_CLASSES` → `IsAuthenticated`, `EXCEPTION_HANDLER` → `core.exception_handler.custom_exception_handler`
- [x] 3.3 Add `SIMPLE_JWT` config block (access token 60 min, refresh token 7 days)
- [x] 3.4 Add `drf_spectacular` to `INSTALLED_APPS` and configure `SPECTACULAR_SETTINGS` (title, version, serve at `/api/schema/swagger-ui/`)
- [x] 3.5 Add `rest_framework_simplejwt.token_blacklist` to `INSTALLED_APPS`
- [x] 3.6 Run `docker compose run --rm api python manage.py migrate` to apply the token blacklist migration (creates `token_blacklist_*` tables)

## 4. Exception Handler

- [x] 4.1 Create `core/exception_handler.py` with `custom_exception_handler(exc, context)` that reshapes all `APIException` responses into `{"error": "ERROR_CODE", "message": "...", "fields": {...}}`

## 5. Onboarding Service

- [x] 5.1 Create `api/` directory and `api/__init__.py` (if not present)
- [x] 5.2 Create `api/services/__init__.py` and `api/services/onboarding.py` with `create_default_categories(user)` — creates the 4 default categories inside `transaction.atomic()`

## 6. Registration Endpoint

- [x] 6.1 Create `users/serializers.py` with `RegisterSerializer` — validates `email` (unique) and `password` (min 8 chars), creates User via `User.objects.create_user(email=..., password=...)`
- [x] 6.2 Create `users/views.py` with `RegisterView(APIView)` — `permission_classes = [AllowAny]`, validates via `RegisterSerializer`, calls `create_default_categories(user)` from the onboarding service inside `transaction.atomic()`, generates JWT tokens, returns 201 with `{access, refresh, user: {id, email}}`
- [x] 6.3 Create `users/urls.py` with `register/` path pointing to `RegisterView`
- [x] 6.4 Update `core/urls.py` to include `api/auth/` → `users.urls`, JWT token URLs (`api/auth/token/`, `api/auth/token/refresh/`, and `api/auth/token/revoke/` via `TokenBlacklistView`), and drf-spectacular schema + swagger-ui URLs

## 7. Tests

Use `pytest-django` with `factory_boy` + `Faker`. Use `APIClient` from DRF for endpoint tests.

- [x] 7.1 Update `tests/factories/user.py` to use email-only UserFactory (no `username`)
- [x] 7.2 Create `tests/test_auth.py` with tests for:
  - Successful registration returns 201 + JWT tokens + user `{id, email}`
  - Registration creates 4 default categories for the new user
  - Duplicate email registration returns 400
  - Password shorter than 8 chars returns 400
  - Missing email or password returns 400
  - Successful login (`POST /api/auth/token/`) returns 200 + `{access, refresh}`
  - Wrong password returns 401
  - Token refresh (`POST /api/auth/token/refresh/`) returns 200 + new `access` token
  - Token revoke (`POST /api/auth/token/revoke/`) returns 200 and blacklists the refresh token
  - Revoked refresh token cannot be used to refresh (returns 401)
  - Revoke with invalid token returns 400
- [x] 7.3 Run `docker compose run --rm api python -m pytest tests/ --cov=users --cov=api --cov-report=term-missing` and confirm all tests pass with coverage ≥ 90%
