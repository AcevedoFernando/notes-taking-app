## Context

The `Category` model and factory already exist. Four default categories are created on user registration via the onboarding service. The notes API (recently implemented) references categories by FK but there are no endpoints to manage them. This change adds `CategoryViewSet` to the existing `notes` app alongside `NoteViewSet`, reusing the same serializer/service/URL structure established for notes.

## Goals / Non-Goals

**Goals:**
- Implement all 6 REST endpoints for categories (list, create, retrieve, update, patch, delete)
- Enforce ownership (IDOR protection) — users only see and modify their own categories
- Enforce the `unique_together = ('name', 'user')` constraint at the serializer level with a clear 400 error
- Apply the service-layer pattern: business logic in `notes/services.py`
- Achieve >90% test coverage

**Non-Goals:**
- Changing the onboarding flow (default categories on registration are out of scope)
- Filtering or searching categories (the list is small and user-scoped; no filter params needed)
- Returning note counts per category (a future enhancement)

## Decisions

### 1. `CategoryViewSet` lives in `notes/views.py` alongside `NoteViewSet`

Category and Note are in the same Django app. Keeping both viewsets in `notes/views.py` avoids creating a new file for a thin viewset. They share the same serializer and service module.

_Alternative considered_: Separate `notes/category_views.py` — rejected as unnecessary fragmentation for two closely related viewsets.

### 2. Single `notes/urls.py` router registers both resources

The existing `DefaultRouter` in `notes/urls.py` registers `NoteViewSet`. We add `CategoryViewSet` there rather than creating a separate `categories/urls.py`, keeping URL wiring in one place.

_Alternative considered_: Separate `api/categories/` include in `core/urls.py` — rejected because it adds another URL registration when the notes app already owns the category model.

### 3. `unique_together` validation handled in `CategorySerializer.validate()`

DRF does not automatically surface `unique_together` constraints as field-level 400 errors; it raises `IntegrityError` at the DB layer. We validate uniqueness in `validate()` by querying before save, returning a proper `{"error": "VALIDATION_ERROR", "fields": {"name": [...]}}` response.

_Alternative considered_: Catch `IntegrityError` in the view — rejected because it bypasses the custom exception handler and leaks DB error strings.

### 4. Queryset-level ownership filtering (same pattern as notes)

`get_queryset()` always filters by `request.user`, so list and detail endpoints both enforce ownership at DB level. Other users' categories return 404, not 403.

## Risks / Trade-offs

- [Deleting a category nullifies notes] Cascading `SET_NULL` means notes lose their category silently. → No mitigation; this is the intended data model behavior and is documented in the spec.
- [Duplicate name check race condition] The uniqueness check in `validate()` is not atomic with the INSERT under high concurrency. → Mitigation: `ATOMIC_REQUESTS = True` + the DB `unique_together` constraint will catch the race; the exception handler will surface a generic error rather than a structured one in that edge case. Acceptable for this use case.

## Migration Plan

No model or schema changes needed — `Category` model is already fully defined and migrated. This change adds only application-layer code.

1. Add `CategorySerializer` to `notes/serializers.py`
2. Add category service functions to `notes/services.py`
3. Add `CategoryViewSet` to `notes/views.py`
4. Register `CategoryViewSet` in `notes/urls.py`
5. Run tests; confirm >90% coverage.
