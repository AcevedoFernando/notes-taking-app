## ADDED Requirements

### Requirement: Onboarding service creates 4 default categories atomically
The system SHALL provide a service function `create_default_categories(user)` in `api/services/onboarding.py` that creates exactly the following 4 categories for the given user, within a database transaction: "Random Thoughts" (#EF9C66), "School" (#FCDC94), "Personal" (#78ABA8), "Drama" (#C8CFA0).

#### Scenario: All 4 default categories are created
- **WHEN** `create_default_categories(user)` is called with a valid user
- **THEN** exactly 4 `Category` rows are created for that user with the specified names and colors

#### Scenario: Service is transactional
- **WHEN** an exception is raised during category creation (e.g., DB constraint violation)
- **THEN** no partial categories are persisted for that user

### Requirement: Onboarding service is called atomically from registration
The system SHALL invoke `create_default_categories(user)` inside the same `transaction.atomic()` block that creates the user, so that a failure in either operation rolls back both.

#### Scenario: User and categories are created together or not at all
- **WHEN** registration begins and category creation fails mid-way
- **THEN** neither the user nor any partial categories remain in the database
