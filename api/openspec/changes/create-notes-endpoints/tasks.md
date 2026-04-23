## 1. Dependencies & Model

- [x] 1.1 Verify `bleach` is in `requirements.txt`; add it if missing
- [x] 1.2 Confirm `Note` model has all required fields (`id` UUID PK, `user` FK, `category` FK nullable, `title`, `content`, `is_pinned`) — add a migration if any fields are missing

## 2. Serializer

- [x] 2.1 Create `notes/serializers.py` with `NoteSerializer` (all Note fields, read-only `user`)
- [x] 2.2 Add `validate_content()` method that runs `bleach.clean()` to strip disallowed HTML tags
- [x] 2.3 Add `validate_category()` method that rejects a category not owned by the request user (return 400 with field error)

## 3. Service Layer

- [x] 3.1 Create `notes/services.py` with `get_user_notes(user, filters)` — returns queryset filtered by user, with `select_related('category')`, supporting `category`, `is_pinned`, and `search` params
- [x] 3.2 Add `create_note(user, validated_data)` — sets `user` from context, saves and returns the note
- [x] 3.3 Add `update_note(instance, validated_data, partial=False)` — updates fields and saves

## 4. Views & URLs

- [x] 4.1 Create `notes/views.py` with `NoteViewSet(ModelViewSet)` — override `get_queryset()` to call `get_user_notes()` service function
- [x] 4.2 Override `perform_create()` to pass `request.user` to `create_note()` service
- [x] 4.3 Override `perform_update()` to call `update_note()` service
- [x] 4.4 Create `notes/urls.py` with `DefaultRouter` registering `NoteViewSet` at `notes`
- [x] 4.5 Include `notes.urls` in `core/urls.py` at path `api/notes/`

## 5. Authentication

- [x] 5.1 Confirm `IsAuthenticated` permission is applied to `NoteViewSet` (either via `DEFAULT_PERMISSION_CLASSES` or explicitly on the viewset)

## 6. Tests

- [x] 6.1 Create or update `tests/factories/note_factory.py` with `NoteFactory` using `factory_boy` and `Faker`
- [x] 6.2 Write tests for list endpoint: returns only own notes, filters by category/is_pinned/search, 401 for unauthenticated
- [x] 6.3 Write tests for create endpoint: success 201, missing title 400, XSS sanitized, category from other user 400
- [x] 6.4 Write tests for retrieve endpoint: success 200, other user's note 404, nonexistent 404
- [x] 6.5 Write tests for PUT endpoint: success 200, other user's note 404
- [x] 6.6 Write tests for PATCH endpoint: toggle pin 200, update title 200, other user's note 404
- [x] 6.7 Write tests for DELETE endpoint: success 204, other user's note 404, subsequent GET 404
- [x] 6.8 Run tests with coverage and confirm >90% coverage on notes app (`pytest --cov=notes`)
