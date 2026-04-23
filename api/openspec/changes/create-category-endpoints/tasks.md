## 1. Serializer

- [x] 1.1 Add `CategorySerializer` to `notes/serializers.py` with `id`, `name`, `color` fields (read-only `id`, read-only `user` via context)
- [x] 1.2 Add `validate()` to check `unique_together` — query for an existing category with the same `name` for `request.user` (excluding the current instance on update) and raise `ValidationError` on conflict

## 2. Service Layer

- [x] 2.1 Add `get_user_categories(user)` to `notes/services.py` — returns queryset filtered by user, ordered by `id`
- [x] 2.2 Add `create_category(user, validated_data)` — creates and returns a `Category` with `user` set
- [x] 2.3 Add `update_category(instance, validated_data)` — updates fields and saves

## 3. Views & URLs

- [x] 3.1 Add `CategoryViewSet(ModelViewSet)` to `notes/views.py` — override `get_queryset()` to call `get_user_categories()`
- [x] 3.2 Override `create()` in `CategoryViewSet` to call `create_category()` service and re-serialize (same pattern as `NoteViewSet`)
- [x] 3.3 Override `perform_update()` in `CategoryViewSet` to call `update_category()` service
- [x] 3.4 Register `CategoryViewSet` in `notes/urls.py` at `categories` using the existing `DefaultRouter`

## 4. Tests

- [x] 4.1 Write tests for list endpoint: returns only own categories, other user's categories excluded, 401 for unauthenticated
- [x] 4.2 Write tests for create endpoint: success 201 with id, missing name 400, missing color 400, duplicate name same user 400, same name different users 201
- [x] 4.3 Write tests for retrieve endpoint: success 200, other user's category 404, nonexistent 404
- [x] 4.4 Write tests for PUT endpoint: success 200, other user's category 404, rename to existing name 400
- [x] 4.5 Write tests for PATCH endpoint: update color only 200, other user's category 404
- [x] 4.6 Write tests for DELETE endpoint: success 204, related notes nullified, other user's category 404
- [x] 4.7 Run full test suite with coverage and confirm >90% on notes app
