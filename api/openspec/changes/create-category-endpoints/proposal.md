## Why

Categories exist in the data model and are auto-created on registration, but there are no API endpoints to manage them. Users cannot list, create, rename, recolor, or delete their own categories, making the feature invisible to the frontend.

## What Changes

- Add `GET /api/categories/` — list all categories for the authenticated user
- Add `POST /api/categories/` — create a new category (name + color, unique per user)
- Add `GET /api/categories/<id>/` — retrieve a single category
- Add `PUT /api/categories/<id>/` — fully update a category (name and color)
- Add `PATCH /api/categories/<id>/` — partially update a category
- Add `DELETE /api/categories/<id>/` — delete a category (notes using it are set to null)
- Add `notes/categories/` URL module wired into `core/urls.py` as `api/categories/`
- Add `CategorySerializer` in `notes/serializers.py`
- Add category service functions in `notes/services.py`
- Enforce IDOR protection: users can only access their own categories

## Capabilities

### New Capabilities

- `categories-crud`: Full CRUD API for categories — list, create, retrieve, update, patch, delete — with ownership enforcement and unique-name validation per user

### Modified Capabilities

<!-- No existing specs require requirement changes -->

## Impact

- **Modified files**: `notes/serializers.py` (add `CategorySerializer`), `notes/services.py` (add category service functions), `notes/views.py` (add `CategoryViewSet`), `notes/urls.py` (register category router)
- **Modified files**: `core/urls.py` (add categories URL include)
- **APIs**: Exposes 6 new REST endpoints under `/api/categories/`
- **Security**: All endpoints require authentication; IDOR protection ensures users only access their own categories
- **Data integrity**: Deleting a category sets `category` to null on associated notes (already enforced by `SET_NULL` in the model)
