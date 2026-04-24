# 🚀 Project Commands Reference

This document serves as a quick reference for all the essential commands needed to develop, test, and deploy the **Notes Taking App**.

---

## 🛠️ Initialization & Setup

Before starting, ensure you have copied the environment variables:

```bash
# Root: No specific root setup usually, but ensure Docker is installed.

# Web (Frontend)
cd web
cp .env.example .env
pnpm install # or npm install

# API (Backend)
cd api
cp .env.example .env
# If running locally without Docker:
pip install -r requirements.txt
```

---

## 🐳 Docker Commands (Root)

Most development tasks should be performed using Docker Compose from the root directory.

| Command | Description |
| :--- | :--- |
| `docker compose up` | Start all services (PostgreSQL, API, Web) |
| `docker compose up --build` | Rebuild and start all services |
| `docker compose down` | Stop and remove all containers |
| `docker compose logs -f` | Tail logs for all services |
| `docker compose run --rm api <cmd>` | Run a command inside the API container |
| `docker compose run --rm web <cmd>` | Run a command inside the Web container |

---

## 🌐 Web (Frontend) Commands

Located in the `./web` directory.

### ⚡ Development & Build
- **Start Dev Server:** `pnpm dev` (Next.js)
- **Build Production:** `pnpm build`
- **Start Production:** `pnpm start`

### 🧪 Testing
- **Unit Tests (Vitest):** `pnpm test:unit`
- **Unit Tests Watch:** `pnpm test:unit:watch`
- **E2E Tests (Playwright):** `pnpm test:e2e`
- **E2E UI Mode:** `pnpm test:e2e:ui`
- **E2E Report:** `pnpm test:e2e:report`

> **NOTE:** For E2E tests to work, make sure the web application and API are running, and ensure `E2E_TEST_USER_EMAIL` and `E2E_TEST_USER_PASSWORD` are set in the `.env` file.

### 🎨 Storybook
- **Start Storybook:** `pnpm storybook` (Runs on port 6006)
- **Build Storybook:** `pnpm build-storybook`

### 🧹 Linting
- **Check Lint:** `pnpm lint`
- **Fix Lint:** `pnpm lint:fix`

---

## ⚙️ API (Backend) Commands

Located in the `./api` directory. Commands can be run via Docker (recommended) or locally.

### 🐍 Development
- **Run Server:** `python manage.py runserver`
- **Via Docker:** `docker compose up api`

### 🗄️ Database & Migrations
- **Create Migrations:** `python manage.py makemigrations`
- **Apply Migrations:** `python manage.py migrate`
- **Via Docker:** `docker compose run --rm api python manage.py migrate`

### 🧪 Testing & Quality
- **Run Tests (Pytest):** `pytest`
- **Via Docker:** `docker compose run --rm api pytest`
- **With Coverage:** `pytest --cov=.`
- **Shell:** `python manage.py shell`

---

## 📝 Other Relevant Info

- **API URL:** `http://localhost:8000`
- **Web URL:** `http://localhost:3000`
- **Storybook URL:** `http://localhost:6006`
- **PostgreSQL:** Port `5432` (Internal/Docker)
