from rest_framework.views import exception_handler

_TECHNICAL_MESSAGES = {
    'No active account found with the given credentials': 'Invalid email or password.',
    'Given token not valid for any token type': 'Your session has expired. Please log in again.',
    'Token is blacklisted': 'Your session has expired. Please log in again.',
    'Token is invalid or expired': 'Your session has expired. Please log in again.',
    'Authentication credentials were not provided.': 'Please log in to continue.',
}

_STATUS_MESSAGES = {
    401: 'Your session has expired. Please log in again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    429: 'Too many requests. Please slow down and try again.',
    500: 'Something went wrong on our end. Please try again later.',
}

_STATUS_CODES = {
    401: 'AUTHENTICATION_FAILED',
    403: 'PERMISSION_DENIED',
    404: 'NOT_FOUND',
    429: 'THROTTLED',
}


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return None

    detail = getattr(exc, 'detail', None)
    status_code = response.status_code

    if isinstance(detail, dict):
        fields = {
            field: [str(e) for e in errors] if isinstance(errors, list) else [str(errors)]
            for field, errors in detail.items()
        }
        first_field = next(iter(fields))
        message = fields[first_field][0] if fields[first_field] else 'Validation failed'
        response.data = {'error': 'VALIDATION_ERROR', 'message': message, 'fields': fields}

    elif isinstance(detail, list):
        message = str(detail[0]) if detail else 'Validation failed'
        response.data = {'error': 'VALIDATION_ERROR', 'message': message}

    else:
        error_code = _STATUS_CODES.get(status_code, 'ERROR')
        raw = str(detail) if detail else None
        message = _TECHNICAL_MESSAGES.get(raw) or _STATUS_MESSAGES.get(status_code) or raw or 'An unexpected error occurred.'
        response.data = {'error': error_code, 'message': message}

    return response
