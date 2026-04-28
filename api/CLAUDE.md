# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Django REST Framework API for a notes-taking app. Part of a monorepo at `../` that also contains a Next.js frontend (`../web`). The full stack is orchestrated via `../docker-compose.yml`.

## Commands

All development runs through Docker Compose from the **project root** (`../`):

```bash
# Start all services (PostgreSQL + Redis + Django API on port 8000)
docker compose up

# Run Django management commands inside the container
docker compose run --rm api python manage.py <command>

# Apply migrations
docker compose run --rm api python manage.py migrate

# Create migrations
docker compose run --rm api python manage.py makemigrations

# Run tests (dev deps installed on the fly)
docker compose run --rm api sh -c "pip install -q -r requirements/dev.txt && pytest -q"

# Open Django shell
docker compose run --rm api python manage.py shell
```

For local development without Docker (requires PostgreSQL and Redis running locally):

```bash
pip install -r api/requirements/dev.txt
DJANGO_SETTINGS_MODULE=core.settings.dev python manage.py runserver
```

## Architecture

### Stack
- **Django 5.2** + **Django REST Framework** — API layer
- **PostgreSQL 15** — primary database (via `psycopg2-binary`)
- **Redis 7** — DRF throttle counters and cache (via the built-in `django.core.cache.backends.redis.RedisCache`)
- **django-cors-headers** — CORS origins read from `CORS_ALLOWED_ORIGINS`

### Settings layout
Settings live in the `core/settings/` package:
- `core/settings/base.py` — shared config (apps, DRF, JWT, CORS, cache, logging)
- `core/settings/dev.py` — local dev (`DEBUG=True`, falls back to `LocMemCache` when `REDIS_URL` is unset)
- `core/settings/prod.py` — production hardening (HSTS, secure cookies, SSL redirect, Sentry with PII scrubbed and `traces_sample_rate=0.1`)

Selection is via `DJANGO_SETTINGS_MODULE`. `manage.py`, `wsgi.py`, and `asgi.py` default to `core.settings.dev`. Production deployments must set `DJANGO_SETTINGS_MODULE=core.settings.prod` and provide `DJANGO_SECRET_KEY`, `DATABASE_URL`, `ALLOWED_HOSTS`, `REDIS_URL`, `CORS_ALLOWED_ORIGINS` (and optionally `SENTRY_DSN`, `SENTRY_TRACES_SAMPLE_RATE`).

### Dependencies
- `requirements/base.txt` — runtime deps; pinned. The Docker image installs only this file.
- `requirements/dev.txt` — `-r base.txt` plus `pytest`, `factory_boy`, `pytest-cov`, `freezegun`, `Faker`. Used for local development and CI test runs.

When upgrading, regenerate the pinned files with `pip-compile` (or `uv pip compile`) from a clean environment.

### URL Routing
`core/urls.py` is the root router. The notes app routes are mounted at `/api/`. Auth endpoints (`/api/auth/register/`, `/api/auth/me/`, `/api/auth/token/...`) live in `users/urls.py` and `core/urls.py`.

### Notes app
- `notes/models.py` — `Note` and `Category` models. `Note` has composite indexes on `(user, -created_at)` and `(user, category)` and `Meta.ordering = ['-created_at']`.
- `notes/views.py` — `NoteViewSet` and `CategoryViewSet`. Both use `[IsAuthenticated, IsOwner]` and delegate writes to services. List uses `NotesPagination` (default 50, max 100, query param `?page_size=`).
- `notes/permissions.py` — `IsOwner` object-level permission.
- `notes/services.py` — domain logic for notes/categories. Service-layer guard refuses to attach a category that belongs to a different user (`PermissionDenied`).

### Auth
- `users/views.py:RegisterView` — throttled by `AuthRateThrottle` (10/min). When the email is already registered, it returns a neutral `201 {"detail": "Registration received."}` (no tokens, no user creation) so attackers cannot enumerate accounts.
- JWT via `djangorestframework-simplejwt`; rotation + blacklist enabled.

### Docker
The `../docker-compose.yml` mounts `./api` as a volume into the container at `/app`, so code changes are reflected without rebuilding. Services: `db` (Postgres), `redis`, `api`, `web`. The `api` service sets `DJANGO_SETTINGS_MODULE=core.settings.dev` and `REDIS_URL=redis://redis:6379/0` via the `environment:` block.
