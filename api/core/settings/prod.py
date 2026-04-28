"""Production settings. Selected via DJANGO_SETTINGS_MODULE=core.settings.prod."""

import os

import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

from .base import *  # noqa: F401,F403
from .base import env

DEBUG = False

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')

SECURE_SSL_REDIRECT = env.bool('SECURE_SSL_REDIRECT', default=True)
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = env.int('SECURE_HSTS_SECONDS', default=31536000)
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_REFERRER_POLICY = 'same-origin'
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

_SENSITIVE_BODY_KEYS = {'password', 'access', 'refresh', 'token'}


def _scrub_sentry_event(event, hint):
    request = event.get('request') or {}
    headers = request.get('headers') or {}
    if 'Authorization' in headers:
        headers['Authorization'] = '[Filtered]'
    data = request.get('data')
    if isinstance(data, dict):
        for key in list(data.keys()):
            if key.lower() in _SENSITIVE_BODY_KEYS:
                data[key] = '[Filtered]'
    return event


SENTRY_DSN = os.getenv('SENTRY_DSN')
if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[DjangoIntegration()],
        traces_sample_rate=env.float('SENTRY_TRACES_SAMPLE_RATE', default=0.1),
        send_default_pii=False,
        environment=os.getenv('ENVIRONMENT', 'production'),
        before_send=_scrub_sentry_event,
    )
