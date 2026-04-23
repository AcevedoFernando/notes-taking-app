## ADDED Requirements

### Requirement: User can register with email and password
The system SHALL expose `POST /api/auth/register/` that accepts `email` and `password`, creates a new `User` with a UUID PK, and returns HTTP 201 with a JWT access token, a refresh token, and the new user's `id` and `email`.

#### Scenario: Successful registration
- **WHEN** a POST request is sent to `/api/auth/register/` with a valid unique email and a password of at least 8 characters
- **THEN** HTTP 201 is returned with body `{"access": "<token>", "refresh": "<token>", "user": {"id": "<uuid>", "email": "<email>"}}`

#### Scenario: Registration with duplicate email is rejected
- **WHEN** a POST request is sent to `/api/auth/register/` with an email that already exists in the database
- **THEN** HTTP 400 is returned with a unified error response indicating the email is already taken

#### Scenario: Registration with a short password is rejected
- **WHEN** a POST request is sent to `/api/auth/register/` with a password shorter than 8 characters
- **THEN** HTTP 400 is returned with a unified error response indicating the password is too short

#### Scenario: Registration with missing fields is rejected
- **WHEN** a POST request is sent to `/api/auth/register/` without `email` or without `password`
- **THEN** HTTP 400 is returned with a unified error response listing the missing required fields

### Requirement: Registered user receives default categories
The system SHALL automatically create 4 default categories for the new user immediately after successful registration, within the same database transaction.

#### Scenario: Default categories are created on registration
- **WHEN** a user registers successfully
- **THEN** the user has exactly 4 categories: "Random Thoughts" (#EF9C66), "School" (#FCDC94), "Personal" (#78ABA8), "Drama" (#C8CFA0)

#### Scenario: Category creation failure rolls back user creation
- **WHEN** an error occurs during default category creation
- **THEN** the user record is also rolled back and no partial data is persisted
