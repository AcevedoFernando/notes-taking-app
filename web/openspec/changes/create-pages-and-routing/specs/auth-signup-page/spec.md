## ADDED Requirements

### Requirement: Sign-up page renders at /auth/sign-up with centered layout
The `/auth/sign-up` route SHALL render a centered single-column layout on the brand background `#FAF1E3`. It SHALL display the cactus illustration from `/images/cactus.png` above the form.

#### Scenario: Page renders at correct route
- **WHEN** the user navigates to `/auth/sign-up`
- **THEN** a centered card with the cactus illustration is visible

### Requirement: Sign-up page displays correct title
The sign-up page SHALL display the heading "Yay, You're Back!" in the brand title style (48px, bold, color `#88642A`).

#### Scenario: Heading is visible
- **WHEN** the user is on `/auth/sign-up`
- **THEN** the text "Yay, You're Back!" appears as the page heading

### Requirement: Sign-up page contains email and password inputs
The sign-up page SHALL render an email Input atom and a password Input atom (with visibility toggle).

#### Scenario: Email and password inputs are present
- **WHEN** the user is on `/auth/sign-up`
- **THEN** both an email and a password input field are visible

### Requirement: Sign-up page has a LogIn action button
The sign-up page SHALL render a Button atom labeled "LogIn".

#### Scenario: LogIn button is visible
- **WHEN** the user is on `/auth/sign-up`
- **THEN** a button with the label "LogIn" is visible

### Requirement: Sign-up page has a navigation link to login
The sign-up page SHALL render the link text "Oops! I've never been here before" that navigates to `/auth/login`.

#### Scenario: Navigation link redirects to login
- **WHEN** the user clicks "Oops! I've never been here before" on `/auth/sign-up`
- **THEN** the browser navigates to `/auth/login`
