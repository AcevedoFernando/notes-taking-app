## 1. Scaffold users app

- [x] 1.1 Create the `users/` Django app directory with `__init__.py`, `apps.py`, `models.py`, `admin.py`, and `migrations/__init__.py`
- [x] 1.2 Define `UsersConfig` in `users/apps.py` with `name = 'users'` and `default_auto_field`

## 2. Define User model

- [x] 2.1 Add `User(AbstractUser)` class to `users/models.py` with a `pass` body (no extra fields needed yet)

## 3. Configure Django settings

- [x] 3.1 Add `'users'` (or `'users.apps.UsersConfig'`) to `INSTALLED_APPS` in `core/settings.py`
- [x] 3.2 Set `AUTH_USER_MODEL = 'users.User'` in `core/settings.py`

## 4. Create and apply migration

- [x] 4.1 Run `python manage.py makemigrations users` to generate `users/migrations/0001_initial.py`
- [x] 4.2 Run `python manage.py migrate` to apply the migration and create the `users_user` table

## 5. Register model in admin

- [x] 5.1 Register `User` in `users/admin.py` using `UserAdmin` from `django.contrib.auth.admin`

## 6. Write tests

- [x] 6.1 Add a test in `users/tests.py` that imports `User` and asserts it is a subclass of `AbstractUser`
- [x] 6.2 Add a test that verifies `settings.AUTH_USER_MODEL == 'users.User'`
- [x] 6.3 Run `python manage.py test users` and confirm all tests pass
