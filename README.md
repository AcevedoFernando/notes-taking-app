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
  │     ├── requirements.txt   # Backend dependencies list
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

Running the project on any machine is straightforward thanks to the native Docker implementation. The system will instantiate 3 services: `db` (PostgreSQL), `api`, and `web`.

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

## Additional Relevant Information

- **Quality Assurance (Testing):**
  - **Web:** Uses **Storybook** to develop visual components in isolation (Component-Driven Development), **Vitest** for unit tests, and **Playwright** to verify complete user flows.
  - **API:** Aims for over 90% coverage. Uses `pytest-django`, fake data generation tools like `factory_boy`/`Faker`, and even Property-Based Testing to validate the OpenAPI schema with `Schemathesis`.
- **Django Services Layer:** A critical point of the architecture is that complex business logic (such as creating a user and chaining the creation of their 4 categories) **must not** reside in views or serializers. This logic must go inside the `/api/services/` directory.
- **Web Package Management:** The frontend uses the `pnpm` tool instead of standard `npm` or `yarn` (evidenced by the `pnpm-lock.yaml` file). When you need to install packages, prefer `pnpm install <package>`.
