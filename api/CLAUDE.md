# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Django REST Framework API for a notes-taking app. Part of a monorepo at `../` that also contains a Next.js frontend (`../web`). The full stack is orchestrated via `../docker-compose.yml`.

## Commands

All development runs through Docker Compose from the **project root** (`../`):

```bash
# Start all services (PostgreSQL + Django API on port 8000)
docker compose up

# Run Django management commands inside the container
docker compose run --rm api python manage.py <command>

# Apply migrations
docker compose run --rm api python manage.py migrate

# Create migrations
docker compose run --rm api python manage.py makemigrations

# Run tests
docker compose run --rm api python manage.py test

# Run a single test
docker compose run --rm api python manage.py test notes.tests.TestClassName.test_method_name

# Open Django shell
docker compose run --rm api python manage.py shell
```

For local development without Docker (requires a running PostgreSQL instance):

```bash
pip install -r requirements.txt
python manage.py runserver
```

## Architecture

### Stack
- **Django 5.2** + **Django REST Framework** — API layer
- **PostgreSQL 15** — primary database (via `psycopg2-binary`)
- **django-cors-headers** — CORS configured to allow `http://localhost:3000` (the Next.js frontend)

### Settings & Environment
`core/settings.py` uses `django-environ` (`import environ`) to read config from `.env`. Copy `.env.example` to `.env` before first run.

**Known dependency mismatch:** `requirements.txt` lists `python-dotenv` but `settings.py` uses `django-environ`. Add `django-environ` to `requirements.txt` if it's missing from the environment.

The database connection uses `env.db()`, which expects a `DATABASE_URL` environment variable (e.g. `DATABASE_URL=postgres://user:pass@db:5432/mydb`). The `.env.example` shows individual `POSTGRES_*` vars — these need to be combined into a single `DATABASE_URL` for the Django settings to work.

### URL Routing
`core/urls.py` is the root router. The `notes` app does not yet have its own `urls.py` — it needs to be created and included here as `path('api/notes/', include('notes.urls'))`.

### Notes App
`notes/` is the primary Django app. Models, views, and tests are currently empty scaffolding — all domain logic goes here.

DRF is configured with `AllowAny` permissions and `SessionAuthentication` globally (`core/settings.py`), so all endpoints are currently open.

### Docker
The `../docker-compose.yml` mounts `./api` as a volume into the container at `/app`, so code changes are reflected without rebuilding. Note: `env_file` in the compose file points to `/api/.env` (absolute path) — this may need to be corrected to `./api/.env` relative to the compose file.
