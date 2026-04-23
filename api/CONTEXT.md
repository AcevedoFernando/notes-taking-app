# Project Context: Notes Taking Service (REST API)

## 1. Executive Summary
**Objective:** A high-performance, scalable REST API for a note-taking application.
**Core Stack:** - **Language/Framework:** Python 3.12+ / Django 5.x.
- **Toolkit:** Django REST Framework (DRF).
- **Database:** PostgreSQL.
- **Authentication:** Stateless JWT via `djangorestframework-simplejwt`.
- **Documentation:** OpenAPI 3.0 via `drf-spectacular`.

## 2. Architectural Principles
- **Service Layer:** All business logic (including user onboarding) must reside in `api/services/`.
- **UUID Strategy:** Use `UUID4` as Primary Keys for `User` and `Note` entities.
- **Query Optimization:** Strict avoidance of N+1 problems using `select_related`, `prefetch_related`, and `annotate`.
- **Atomic Transactions:** `ATOMIC_REQUESTS = True` to ensure data integrity during complex operations.

## 3. Domain Model (Database Schema)

### User
- `id`: UUID (PK)
- `email`: EmailField (Unique, Indexed)
- `password`: Hashed string.

### Category
- `id`: AutoField
- `name`: CharField(100)
- `color`: CharField(7) (Hex format)
- `user`: ForeignKey(User, related_name='categories')
- *Constraint:* `unique_together = ('name', 'user')`.

### Note
- `id`: UUID (PK)
- `user`: ForeignKey(User, related_name='notes')
- `category`: ForeignKey(Category, null=True, on_delete=SET_NULL)
- `title`: CharField(255)
- `content`: TextField (HTML sanitized)
- `is_pinned`: Boolean (Default: False)

## 4. API Contract & Documentation

### OpenAPI Documentation
- All endpoints MUST be documented using **drf-spectacular**.
- Ensure proper use of `@extend_schema` to document query parameters, request bodies, and custom response structures.
- The documentation should be accessible at `/api/schema/swagger-ui/`.

### Auth & Onboarding
- `POST /api/auth/register/`: 
    - **Logic:** Upon successful user creation, the system MUST automatically create the 4 default categories assigned to this specific user.
- `POST /api/auth/token/`: JWT generation.
- `POST /api/auth/token/refresh/`: JWT Rotation.
- `POST /api/auth/token/revoke/`: Token blacklist/removal.

### Categories
- `GET /api/categories/`: List categories belonging to the authenticated user.
    - Param: `?with_counts=true` -> Annotate with `notes_count`.

### Notes
- `GET /api/notes/`: List paginated notes (PageSize: 10).
    - Filters: `category_id`.
- `POST /api/notes/`: Create note (Ensure `category_id` belongs to the `request.user`).
- `PATCH /api/notes/{id}/`: Partial updates.

## 5. Testing Strategy

### Unit & Integration Testing
- **Framework:** `pytest-django`.
- **Object Generation:** `factory_boy` + `Faker` (Avoid static fixtures).
- **Coverage:** `pytest-cov` (Target: >90% coverage).
- **Time Manipulation:** `freezegun` for testing timestamps and `updated_at` logic.

### E2E & Contract Testing
- **Property-Based Testing:** `Schemathesis` to validate the API against the OpenAPI schema.
- **Functional Flows:** `pytest` using DRF's `APIClient` for critical paths (Auth -> Category -> Note).

### Suggested Testing Structure
```text
/api
  └── /tests
        ├── conftest.py          # Global fixtures (api_client, user_factory, etc.)
        ├── /factories           # FactoryBoy definitions
        │     ├── user.py
        │     ├── note.py
        │     └── category.py
        ├── test_auth.py         # Registration and JWT flows
        ├── test_notes.py        # Business logic and CRUD
        └── test_categories.py   # Onboarding and aggregations
```

## 6. Security & Validation
- **XSS Prevention:** All HTML content stored in `Note.content` must be sanitized using the `bleach` library or a similar robust sanitizer before database persistence.
- **Ownership Validation (IDOR Protection):** - Strict permission checks must ensure that a user can only `retrieve`, `update`, or `delete` notes and categories that they own.
    - When creating a note, the system must validate that the `category_id` provided belongs to the `request.user`.
- **Statelessness:** The API must remain stateless, relying entirely on JWT for session management.

## 7. Default Data (Onboarding Template)
To improve User Experience (UX), the system must implement an automatic onboarding process. Upon successful user registration, the system must initialize the following categories for the new user:

| Category Name | Hex Color |
| :--- | :--- |
| **Random Thoughts** | `#EF9C66` |
| **School** | `#FCDC94` |
| **Personal** | `#78ABA8` |
| **Drama** | `#C8CFA0` |

*Note: This process must be wrapped in a database transaction to ensure the user is not created if the category initialization fails.*

## 8. Instructions for Claude (AI Assistant)
- **Code Quality:** Use Python 3.12+ features (like type hinting) and strictly follow PEP 8 standards.
- **Service Layer Pattern:** Business logic (such as the registration + onboarding flow) should be decoupled from the views and placed in `api/services/`.
- **DRF Best Practices:** - Use `ModelSerializer` for data transformation.
    - Use `ViewSets` and `DefaultRouter` for clean and maintainable URL routing.
- **Error Consistency:** Implement a custom exception handler to ensure all error responses follow a unified JSON structure:
  ```json
  {
    "error": "ERROR_CODE",
    "message": "Human-readable description",
    "fields": { "field_name": ["error detail"] }
  }


## 9. Logging & Observability
**Strategy:** Hybrid approach focusing on local traceability and production monitoring.

- **Native Django Logging:** - Output directed to `STDOUT` for seamless integration with Docker logs (`docker compose logs -f`).
    - Log Level: `INFO` for general activity and `ERROR` for failure tracking.
    - Format: Verbose logging including timestamps, module names, and process IDs.
- **Sentry Integration:**
    - **Purpose:** Error tracking, performance monitoring (APM), and distributed tracing.
    - **Scope:** Capture all unhandled exceptions (500 errors) and performance bottlenecks in DB queries.
    - **Environment:** Enabled only when `SENTRY_DSN` is present in the environment variables to avoid overhead in local unit tests.
