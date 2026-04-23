## 1. Dependencies

- [x] 1.1 Add `bleach` to `requirements.txt`

## 2. Model Definition

- [x] 2.1 Add `Note` model to `notes/models.py` with:
  - `id`: `models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)`
  - `user`: `ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notes')`
  - `category`: `ForeignKey('notes.Category', null=True, blank=True, on_delete=models.SET_NULL, related_name='notes')`
  - `title`: `CharField(max_length=255)`
  - `content`: `TextField()`
  - `is_pinned`: `BooleanField(default=False)`
- [x] 2.2 Add `__str__` method returning `self.title`

## 3. Admin Registration

- [x] 3.1 Register `Note` in `notes/admin.py` with `@admin.register(Note)` and `list_display = ('title', 'user', 'category', 'is_pinned')`

## 4. Migration

- [x] 4.1 Run `docker compose run --rm api python manage.py makemigrations notes` to generate `0002_note.py`
- [x] 4.2 Run `docker compose run --rm api python manage.py migrate` to apply the migration
- [x] 4.3 Verify the `notes_note` table exists with UUID PK, FKs to `users_user` and `notes_category`, and the correct columns

## 5. Tests

Use `pytest-django` as the test runner. Generate test objects with `factory_boy` + `Faker` — no static fixtures.

- [x] 5.1 Create `tests/factories/note.py` with a `NoteFactory` (uses `UserFactory` and `CategoryFactory`)
- [x] 5.2 Write a test verifying that a `Note` can be created with `title`, `content`, `user`, and no category
- [x] 5.3 Write a test verifying that `note.id` is a UUID (not an integer)
- [x] 5.4 Write a test verifying that `is_pinned` defaults to `False`
- [x] 5.5 Write a test verifying that a `Note` can be created with a `category`
- [x] 5.6 Write a test verifying that deleting the linked `Category` sets `note.category` to `None` (SET_NULL)
- [x] 5.7 Write a test verifying that deleting the owning `User` cascade-deletes their notes
- [x] 5.8 Run `docker compose run --rm api python -m pytest tests/ --cov=notes --cov-report=term-missing` and confirm all tests pass with coverage ≥ 90%
