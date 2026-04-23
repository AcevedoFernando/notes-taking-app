## Context

The existing `users/models.py` has a minimal `User(AbstractUser)` stub with no customizations — no UUID PK, no email login, still uses `username`. All other models (`Category`, `Note`) already depend on `settings.AUTH_USER_MODEL`. This change must alter `User` before adding any API surface, because the FK targets are already in the DB. The `notes` app migrations (`0001`, `0002`) reference `users_user.id` as a bigint FK — altering User's PK to UUID requires those FKs to be re-created.

## Goals / Non-Goals

**Goals:**
- Replace `User` with a UUID-PK, email-login model (no `username` field)
- `POST /api/auth/register/` — creates user + 4 default categories atomically, returns JWT pair
- `POST /api/auth/token/` and `POST /api/auth/token/refresh/` via simplejwt
- `POST /api/auth/token/revoke/` — blacklists a refresh token via simplejwt's `TokenBlacklistView`; requires `rest_framework_simplejwt.token_blacklist` in `INSTALLED_APPS` and its migration
- `api/services/onboarding.py` service with `create_default_categories(user)`
- Custom DRF exception handler returning unified `{"error", "message", "fields"}` JSON
- OpenAPI docs via drf-spectacular at `/api/schema/swagger-ui/`
- `ATOMIC_REQUESTS = True` in settings

**Non-Goals:**
- Password reset / email verification flows
- OAuth / social login
- Rate limiting

## Decisions

**Email as `USERNAME_FIELD`, no `username`**
`CONTEXT.md` defines `User` with only `id`, `email`, and `password` — no username. Setting `USERNAME_FIELD = 'email'` and `REQUIRED_FIELDS = []` on the custom model, then removing the `username` field, matches the spec and avoids confusion. `simplejwt` uses `USERNAME_FIELD` automatically for token generation.

**UUID4 PK on User via full model rewrite + squashed migration**
The current `User` model and its migration only have the `AbstractUser` defaults (bigint PK). Since no real user data exists in dev, the cleanest path is to delete existing user migrations and write a single `0001_initial.py` that defines `User` from scratch with a UUID PK. This avoids a multi-step `ALTER TABLE` sequence in PostgreSQL and keeps migration history clean. The `notes` FK migrations (`0001`, `0002`) must also be recreated to reference a UUID FK column.

**Registration logic in `api/services/onboarding.py`, not in the view**
Per `CONTEXT.md` architectural principle: all business logic in `api/services/`. The view's only job is to deserialize input, call `register_user(email, password)`, and serialize the response. The service calls `create_default_categories(user)` inside `transaction.atomic()` so that a category failure rolls back the entire user creation.

**`ATOMIC_REQUESTS = True` + explicit `transaction.atomic()` in the service**
`ATOMIC_REQUESTS = True` wraps every request in a transaction, which is enough for simple views. The onboarding service adds an explicit inner `transaction.atomic()` as a savepoint guard, making the intent explicit and testable in isolation (service tests don't need a request context).

**`RegisterView` as a plain `APIView` with `AllowAny` permission, not a ViewSet**
Registration is a single write-only action. A `ViewSet` adds unnecessary routing complexity. `APIView` is simpler, easier to document with `@extend_schema`, and maps directly to `POST /api/auth/register/`.

**simplejwt token views for login, refresh, and revoke**
`djangorestframework-simplejwt` provides `TokenObtainPairView`, `TokenRefreshView`, and `TokenBlacklistView` out of the box. We use all three directly rather than reimplementing — they accept email (because `USERNAME_FIELD = 'email'`), validate credentials, and return `access`/`refresh` tokens. No custom subclassing needed at this stage.

**Token revocation via simplejwt `TokenBlacklistView` and `token_blacklist` app**
`POST /api/auth/token/revoke/` accepts a refresh token and adds it to simplejwt's built-in blacklist table. This requires adding `rest_framework_simplejwt.token_blacklist` to `INSTALLED_APPS` and running its migration. We use simplejwt's `TokenBlacklistView` directly — no custom view needed. The blacklist check is enforced automatically on every `TokenRefreshView` call, so a revoked token cannot be used to get new access tokens. Note that already-issued short-lived access tokens remain valid until they expire — full invalidation requires waiting for the access token TTL (60 min).

**Custom exception handler over DRF's default**
DRF's default handler returns `{"field": ["error"]}` for validation errors and plain strings for others. `CONTEXT.md` requires `{"error": "CODE", "message": "...", "fields": {...}}` uniformly. A single custom handler in `core/exception_handler.py` intercepts all `APIException` subclasses and reshapes them.

## Risks / Trade-offs

- **UUID PK migration wipes dev data** → Acceptable in dev; document clearly. For production, a proper multi-step migration would be needed.
- **`ATOMIC_REQUESTS = True` + long-running requests** → Transactions stay open for the full request duration. Acceptable for this API profile; note it if WebSocket or streaming endpoints are added later.
- **Token blacklist introduces DB read on every refresh** → Each `TokenRefreshView` call queries the blacklist table to check if the token is revoked. This adds one indexed DB read per refresh. Acceptable at this scale; a Redis-backed blacklist can be added later if needed.
- **simplejwt default token lifetime** → Defaults to 5-minute access / 1-day refresh. Should be tuned via `SIMPLE_JWT` settings before production; left at sensible defaults for now.

## Migration Plan

1. Delete `users/migrations/` content and rewrite `0001_initial.py` with UUID-PK User
2. Delete `notes/migrations/0001_initial.py` and `0002_note.py`; regenerate both so FKs reference UUID
3. Drop and recreate the PostgreSQL schema (`migrate --run-syncdb` or full `migrate` on a clean DB)
4. Rollback: restore from git and reset the DB
