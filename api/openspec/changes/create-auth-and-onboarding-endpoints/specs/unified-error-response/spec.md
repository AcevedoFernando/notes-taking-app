## ADDED Requirements

### Requirement: All API errors follow a unified JSON structure
The system SHALL return all error responses (4xx and 5xx) from the REST API in the following JSON structure:
```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description",
  "fields": { "field_name": ["error detail"] }
}
```
The `fields` key SHALL be omitted (or `null`) when the error is not field-specific (e.g., 401, 403, 404).

#### Scenario: Validation error includes fields
- **WHEN** a request fails DRF serializer validation
- **THEN** HTTP 400 is returned with `error`, `message`, and `fields` populated with per-field error details

#### Scenario: Authentication error has no fields
- **WHEN** a request fails authentication (missing or invalid token)
- **THEN** HTTP 401 is returned with `error` and `message` but no `fields` key

#### Scenario: Not-found error has no fields
- **WHEN** a request targets a resource that does not exist
- **THEN** HTTP 404 is returned with `error` and `message` but no `fields` key

### Requirement: Error codes are uppercase snake_case strings
The system SHALL use uppercase snake_case strings for the `error` field (e.g., `VALIDATION_ERROR`, `AUTHENTICATION_FAILED`, `NOT_FOUND`).

#### Scenario: Error code format
- **WHEN** any error response is returned
- **THEN** the `error` field value is a non-empty uppercase string with no spaces
