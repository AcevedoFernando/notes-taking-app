## Context

The notes app has an empty scaffolding: `notes/models.py`, `notes/views.py`, and `notes/tests.py` exist but contain no logic. There are no URLs, serializers, or service functions. The `core/urls.py` has no reference to the notes app. This change wires everything together to expose a fully functional CRUD API for notes.

The stack enforces a service-layer pattern — all business logic must live in service functions, not in views or serializers. DRF views remain thin orchestrators.

## Goals / Non-Goals

**Goals:**
- Implement all 6 REST endpoints for notes (list, create, retrieve, update, patch, delete)
- Enforce ownership (IDOR protection) so users only access their own notes
- Sanitize `content` field with `bleach` to prevent XSS
- Apply the service-layer pattern: business logic in `notes/services.py`
- Support filtering by category and pinned status, and search by title/content
- Achieve >90% test coverage with pytest-django and factory_boy

**Non-Goals:**
- Authentication endpoints (handled separately)
- Category CRUD endpoints (separate change)
- Pagination beyond a simple page-size default
- Bulk operations (bulk delete, bulk pin)

## Decisions

### 1. Service layer in `notes/services.py` (not `api/services/`)

The context mentions `api/services/` but the project root has no `api/` module — everything is inside the `notes/` app. Services go in `notes/services.py` to stay within the app boundary.

_Alternative considered_: Inline logic in views — rejected because it mixes concerns and makes testing harder.

### 2. `ModelViewSet` with explicit action routing

Using `ModelViewSet` gives list/create/retrieve/update/partial_update/destroy for free. Routing via `DefaultRouter` keeps `urls.py` minimal.

_Alternative considered_: Manual `APIView` per endpoint — rejected because it requires more boilerplate for the same result.

### 3. Queryset-level ownership filtering, not object-level only

`get_queryset()` always filters by `request.user`, so list and detail endpoints both enforce ownership at the DB level. `get_object()` then naturally returns 404 for other users' notes rather than 403, avoiding user enumeration.

_Alternative considered_: `IsOwner` permission class on detail actions only — rejected because it leaks existence via 403 vs 404.

### 4. `bleach.clean()` called in the serializer's `validate_content` method

Sanitization happens at deserialization time, before the model is ever written. This ensures content stored in the DB is always clean regardless of which code path writes it.

_Alternative considered_: Override `Note.save()` — rejected because it creates hidden behavior and complicates testing.

### 5. Filtering via `django-filter` or manual query params

Given the minimal filter set (category, is_pinned, search), manual `filter()` in `get_queryset()` is sufficient — no need to add `django-filter` as a dependency.

## Risks / Trade-offs

- [bleach dependency] bleach has been in maintenance mode; if it becomes unavailable, we'd need to switch to `nh3`. → Mitigation: pin the version, move sanitization to a single helper function so the swap is one-line.
- [N+1 on list] List endpoint serializes `category` name. → Mitigation: apply `select_related('category')` in `get_queryset()`.
- [UUID PK in URLs] UUID-based URLs are harder to guess but are longer. Clients must store the full UUID. → No mitigation needed; this is by design.

## Migration Plan

1. Confirm `bleach` is in `requirements.txt`; add if missing.
2. Create `notes/serializers.py`, `notes/services.py`, `notes/views.py`, `notes/urls.py`.
3. Update `core/urls.py` to include `notes.urls`.
4. Run `python manage.py makemigrations` if any model changes are needed (likely none).
5. Run tests; fix any failures before merging.

No data migrations required. No rollback strategy needed — adding new endpoints is non-breaking.
