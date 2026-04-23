## ADDED Requirements

### Requirement: User can obtain JWT tokens with email and password
The system SHALL expose `POST /api/auth/token/` that accepts `email` and `password` and returns an access token and a refresh token on success.

#### Scenario: Successful login
- **WHEN** a POST request is sent to `/api/auth/token/` with a valid registered email and correct password
- **THEN** HTTP 200 is returned with body `{"access": "<token>", "refresh": "<token>"}`

#### Scenario: Login with wrong password is rejected
- **WHEN** a POST request is sent to `/api/auth/token/` with a valid email but incorrect password
- **THEN** HTTP 401 is returned with a unified error response

#### Scenario: Login with unknown email is rejected
- **WHEN** a POST request is sent to `/api/auth/token/` with an email that does not exist
- **THEN** HTTP 401 is returned with a unified error response

### Requirement: User can refresh an access token
The system SHALL expose `POST /api/auth/token/refresh/` that accepts a valid refresh token and returns a new access token.

#### Scenario: Successful token refresh
- **WHEN** a POST request is sent to `/api/auth/token/refresh/` with a valid, non-expired refresh token
- **THEN** HTTP 200 is returned with body `{"access": "<new_token>"}`

#### Scenario: Refresh with an invalid token is rejected
- **WHEN** a POST request is sent to `/api/auth/token/refresh/` with a malformed or expired refresh token
- **THEN** HTTP 401 is returned with a unified error response

### Requirement: User can revoke a refresh token
The system SHALL expose `POST /api/auth/token/revoke/` that accepts a valid refresh token in the request body and adds it to the token blacklist, permanently preventing it from being used to obtain new access tokens.

#### Scenario: Successful token revocation
- **WHEN** a POST request is sent to `/api/auth/token/revoke/` with a valid refresh token
- **THEN** HTTP 200 is returned and the token is blacklisted

#### Scenario: Revoked token cannot be refreshed
- **WHEN** a POST request is sent to `/api/auth/token/refresh/` with a previously revoked refresh token
- **THEN** HTTP 401 is returned with a unified error response

#### Scenario: Revoke with an invalid token is rejected
- **WHEN** a POST request is sent to `/api/auth/token/revoke/` with a malformed or already-expired token
- **THEN** HTTP 401 is returned (simplejwt raises `InvalidToken` which is a subclass of `AuthenticationFailed`)
