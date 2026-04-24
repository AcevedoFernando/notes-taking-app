## ADDED Requirements

### Requirement: Login page renders at /auth/login with centered layout
The `/auth/login` route SHALL render a centered single-column layout on the brand background `#FAF1E3`. It SHALL display the cat illustration from `/images/cat.png` above the form.

#### Scenario: Page renders at correct route
- **WHEN** the user navigates to `/auth/login`
- **THEN** a centered card with the cat illustration is visible

### Requirement: Login page displays correct title
The login page SHALL display the heading "Yay, New Friend!" in the brand title style (48px, bold, color `#88642A`).

#### Scenario: Heading is visible
- **WHEN** the user is on `/auth/login`
- **THEN** the text "Yay, New Friend!" appears as the page heading

### Requirement: Login page contains email and password inputs
The login page SHALL render an email Input atom and a password Input atom (with visibility toggle). Both SHALL use the branded outlined style.

#### Scenario: Email input is present
- **WHEN** the user is on `/auth/login`
- **THEN** an email input field with appropriate placeholder is visible

#### Scenario: Password input with toggle is present
- **WHEN** the user is on `/auth/login`
- **THEN** a password input field with an eye/eye-off toggle is visible

### Requirement: Login page has a SignUp action button
The login page SHALL render a Button atom labeled "SignUp".

#### Scenario: SignUp button is visible
- **WHEN** the user is on `/auth/login`
- **THEN** a button with the label "SignUp" is visible

### Requirement: Login page has a navigation link to sign-up
The login page SHALL render the link text "We're already friends!" that navigates to `/auth/sign-up`.

#### Scenario: Navigation link redirects to sign-up
- **WHEN** the user clicks "We're already friends!" on `/auth/login`
- **THEN** the browser navigates to `/auth/sign-up`

### Requirement: Root route redirects to login
The `/` route SHALL redirect to `/auth/login` without rendering any content.

#### Scenario: Root redirect
- **WHEN** the user navigates to `/`
- **THEN** they are redirected to `/auth/login`
