"""Development settings. Default for local Docker Compose."""

from .base import *  # noqa: F401,F403
from .base import env

DEBUG = True
ALLOWED_HOSTS = ['*']

# If REDIS_URL is unset, fall back to in-process cache so contributors can
# run the API without standing up Redis locally. Throttles will only hold
# per worker in that case, which is acceptable for development.
if env('REDIS_URL', default=None) is None:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'dev-locmem',
        }
    }
