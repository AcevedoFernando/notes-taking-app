# Complete Project Report: Notes Taking App

## Executive Summary
The "Notes Taking App" project is a complete note-taking platform based on a client-server architecture. The project is structurally divided into two fundamental parts:
1. **API (Backend):** Developed with Python 3.12+ and Django Rest Framework (DRF).
2. **Web (Frontend):** Developed with Next.js 14+ (App Router), Tailwind CSS, and React.

The entire environment is packaged and orchestrated locally using Docker Compose, ensuring uniformity and portability.

---

## Functionality

### 1. Backend (API)
The API exposes the endpoints that power the interface, built following strict RESTful standards. Its key capabilities include:
- **Stateless Authentication:** Use of JSON Web Tokens (JWT) through `djangorestframework-simplejwt`. It supports token registration, generation, rotation, and revocation.
- **Advanced Management of Notes and Categories:**
  - Notes support sanitized HTML for rich text (using the `bleach` library to prevent XSS).
  - Each entity (Note or User) is identified internally with a `UUID4` for security purposes.
  - Ownership validation (IDOR): The system restricts access so that a user can only view and manipulate their own information.
- **Automatic Onboarding Flow:** Upon completing a new registration, the backend enters a database transaction to generate 4 default categories (Random Thoughts, School, Personal, Drama) associated with the new user.
- **Living Documentation:** Implementation of OpenAPI 3.0, allowing visualization of active endpoints and schemas from `/api/schema/swagger-ui/`.

### 2. Frontend (Web)
The web application provides a visually appealing user interface, heavily relying on a design token system ("Notes Flow").
- **Authentication and Welcome Flows:** Interactive screens for Log In (`/auth/login`) and Sign Up (`/auth/sign-up`).
- **User Dashboard (`/home`):**
  - A side panel that allows real-time note filtering through categories created by the user.
  - The main panel displays a grid layout (3-column grid) with the user's notes rendered as cards.
- **Atomic Design and Reactive Interface:** 
  - The interface dynamically assigns CSS properties (such as border color and 50% opacity background) based on the hex color of the category selected for each note.
  - Use of subtle animations and modern icons using `lucide-react`.

---

## Project Structure

The system is organized in a monorepo structure containing the resources for both ecosystems:

```text
/notes-taking-app
  ├── /api                     # API source code (Backend - Django)
  │     ├── /core              # Django configurations (settings, asgi, wsgi)
  │     ├── /notes             # Django App responsible for Notes and Categories
  │     ├── /users             # Django App responsible for Authentication
  │     ├── /services          # Business logic (isolated from views and serializers)
  │     ├── /tests             # Testing environment (pytest, factories)
  │     ├── Dockerfile         # Image build instructions for the Python container
  │     ├── requirements/      # Pinned dependencies — base.txt (runtime), dev.txt (tests)
  │     ├── manage.py          # Native Django administration script
  │     └── CONTEXT.md         # Detailed Backend architecture documentation
  │
  ├── /web                     # Web source code (Frontend - Next.js)
  │     ├── /src               # Next.js base directory (App Router, components, hooks)
  │     ├── /public            # Static images and icons
  │     ├── /e2e               # End-to-end flow tests (Playwright)
  │     ├── /.storybook        # Component-Driven Development configuration
  │     ├── Dockerfile         # Image build instructions for the Node/Next container
  │     ├── package.json       # Package configuration and NPM dependencies
  │     └── CONTEXT.md         # Detailed Web design documentation
  │
  ├── docker-compose.yml       # General orchestrator (spins up Frontend, Backend, and PostgreSQL)
  └── README.md                # Initial project reference
```

---

## Local Getting Started Guide

Running the project on any machine is straightforward thanks to the native Docker implementation. The system will instantiate 4 services: `db` (PostgreSQL), `redis`, `api`, and `web`.

### Prerequisites
- Install Docker Desktop and have the ability to run `docker compose`.

### Instructions

1. **Environment Variables Configuration:**
   For both environments (`/api` and `/web`), you will find environment example files named `.env.example`. Copy these files and rename them to `.env`:
   - Inside `/api`: `cp .env.example .env`
   - Inside `/web`: `cp .env.example .env`

2. **Spin Up the Containers:**
   Go back to the project root (`/notes-taking-app`) and build the containers with:
   ```bash
   docker compose up --build
   ```

3. **Migrate the Database:**
   Only on the first run, it is necessary to sync the API's PostgreSQL schema:
   ```bash
   docker compose run --rm api python manage.py migrate
   ```

4. **Access the Services:**
   Once the containers are successfully started, you will have access to:
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:8000](http://localhost:8000)
   - **Swagger (Documentation):** [http://localhost:8000/api/schema/swagger-ui/](http://localhost:8000/api/schema/swagger-ui/)

---

## Production Hardening Notes (April 2026)

The API was hardened for production deployment:

- **Settings split into a package**: `core/settings/{base,dev,prod}.py`. Local dev defaults to `core.settings.dev`; deploy with `DJANGO_SETTINGS_MODULE=core.settings.prod`.
- **HTTPS / HSTS / secure cookies** enforced in `prod.py`.
- **Redis is now required** as the cache backend so DRF throttles work across multiple workers. Local Docker Compose includes it automatically; for non-Docker dev, `REDIS_URL` may be left unset and the dev settings fall back to in-memory cache.
- **Pinned dependencies** are split into `api/requirements/base.txt` (runtime, installed in the image) and `api/requirements/dev.txt` (tests).
- **Sentry** runs only in `prod.py`, with `traces_sample_rate=0.1` (override via `SENTRY_TRACES_SAMPLE_RATE`), `send_default_pii=False`, and a `before_send` hook that scrubs `Authorization` headers and `password`/`access`/`refresh` body fields.

### Frontend-impacting change: registration response

To stop email-enumeration attacks, `POST /api/auth/register/` no longer returns `400` when an email is already registered. Both new registrations and duplicate attempts return `201`, but the response shape differs:

- **New registration** → `{ "access": "...", "refresh": "...", "user": { "id": "...", "email": "..." } }`
- **Email already exists** → `{ "detail": "Registration received." }` (no tokens)

The web app should treat the absence of `access`/`refresh` in a 201 response as "verify your email" UX (or whatever onboarding flow is appropriate) instead of an immediate logged-in state.

The endpoint is also rate-limited (`AuthRateThrottle`, 10/minute by IP).

---

## Additional Relevant Information

- **Quality Assurance (Testing):**
  - **Web:** Uses **Storybook** to develop visual components in isolation (Component-Driven Development), **Vitest** for unit tests, and **Playwright** to verify complete user flows.
  - **API:** Aims for over 90% coverage. Uses `pytest-django`, fake data generation tools like `factory_boy`/`Faker`, and even Property-Based Testing to validate the OpenAPI schema with `Schemathesis`.
- **Django Services Layer:** A critical point of the architecture is that complex business logic (such as creating a user and chaining the creation of their 4 categories) **must not** reside in views or serializers. This logic must go inside the `/api/services/` directory.
- **Web Package Management:** The frontend uses the `pnpm` tool instead of standard `npm` or `yarn` (evidenced by the `pnpm-lock.yaml` file). When you need to install packages, prefer `pnpm install <package>`.

---

## Workflow & AI Integration

The foundations and major features of both the API and Web projects were built using **OpenSpec** and **Claude Code (Sonnet)**. 

**OpenSpec** played a crucial role in the development process. By providing structured, clear, and strict specifications, it guided the AI assistants effectively, ensuring the generated code aligned perfectly with the intended architecture and business requirements. This specification-driven approach was instrumental in avoiding AI hallucinations and maintaining high code quality throughout the project.

---

## Time Investment & Breakdown

The entire project took approximately **8 hours** to complete from start to finish. The effort was distributed as follows:

- **20% Analysis**: Understanding requirements, setting up the initial architecture, and defining the data models.
- **30% Design**: UI/UX design, creating the design system ("Notes Flow"), and planning component structures.
- **40% Development**: 
  - *30% AI-Assisted Development*: Utilizing Claude Code and OpenSpec for rapid implementation of foundations and core features.
  - *10% Manual Development*: Fine-tuning, custom logic implementation, and resolving specific edge cases.
- **10% Testing & Quality Assurance**: Writing unit tests, E2E flows, and manual validation.
