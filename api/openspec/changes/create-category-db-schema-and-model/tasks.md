## 1. Model Definition

- [x] 1.1 Add `Category` model to `notes/models.py` with:
  - `name`: `CharField(max_length=100)`
  - `color`: `CharField(max_length=7)` (hex, e.g. `#EF9C66`)
  - `user`: `ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='categories')`
  - `class Meta`: `unique_together = ('name', 'user')`
- [x] 1.2 Add `__str__` method returning `self.name`

## 2. Admin Registration

- [x] 2.1 Register `Category` in `notes/admin.py` with `@admin.register(Category)` and `list_display = ('name', 'color', 'user')`

## 3. Migration

- [x] 3.1 Run `docker compose run --rm api python manage.py makemigrations notes` to generate the migration
- [x] 3.2 Run `docker compose run --rm api python manage.py migrate` to apply the migration
- [x] 3.3 Verify the `notes_category` table exists with the correct columns and `unique_together` constraint

## 4. Tests

Use `pytest-django` as the test runner. Generate test objects with `factory_boy` + `Faker` — no static fixtures. Use `freezegun` for any timestamp assertions.

- [x] 4.1 Create `tests/factories/category.py` with a `CategoryFactory` (requires a `UserFactory` from the User change)
- [x] 4.2 Write a test verifying that a `Category` can be created with `name`, `color`, and `user`
- [x] 4.3 Write a test verifying that a duplicate `(name, user)` pair raises `IntegrityError`
- [x] 4.4 Write a test verifying that two different users MAY have a `Category` with the same `name` (no error)
- [x] 4.5 Write a test verifying that deleting the owning `User` cascade-deletes their categories
- [x] 4.6 Write a test verifying that `category.id` is a positive integer (AutoField, not UUID)
- [x] 4.7 Run `docker compose run --rm api pytest --cov=notes --cov-report=term-missing` and confirm coverage ≥ 90%
