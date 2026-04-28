"""Smoke tests for the production settings module.

We import `core.settings.prod` directly with the env vars it requires and
assert that the security flags expected by the production-hardening change
are set. The module is imported in a fresh environment so it does not
become the active Django settings for the rest of the suite.
"""

import importlib
import os
import sys

import pytest


@pytest.fixture
def prod_settings(monkeypatch):
    monkeypatch.setenv('DJANGO_SECRET_KEY', 'test-secret-do-not-use')
    monkeypatch.setenv('DJANGO_DEBUG', 'False')
    monkeypatch.setenv('DATABASE_URL', 'postgres://u:p@localhost:5432/db')
    monkeypatch.setenv('ALLOWED_HOSTS', 'example.com,api.example.com')
    monkeypatch.setenv('REDIS_URL', 'redis://localhost:6379/0')
    monkeypatch.setenv('CORS_ALLOWED_ORIGINS', 'https://app.example.com')
    monkeypatch.delenv('SENTRY_DSN', raising=False)
    sys.modules.pop('core.settings.prod', None)
    sys.modules.pop('core.settings.base', None)
    module = importlib.import_module('core.settings.prod')
    yield module
    sys.modules.pop('core.settings.prod', None)


def test_debug_is_false(prod_settings):
    assert prod_settings.DEBUG is False


def test_security_headers_set(prod_settings):
    assert prod_settings.SECURE_SSL_REDIRECT is True
    assert prod_settings.SECURE_PROXY_SSL_HEADER == ('HTTP_X_FORWARDED_PROTO', 'https')
    assert prod_settings.SESSION_COOKIE_SECURE is True
    assert prod_settings.CSRF_COOKIE_SECURE is True
    assert prod_settings.SECURE_HSTS_SECONDS == 31536000
    assert prod_settings.SECURE_HSTS_INCLUDE_SUBDOMAINS is True
    assert prod_settings.SECURE_HSTS_PRELOAD is True
    assert prod_settings.SECURE_REFERRER_POLICY == 'same-origin'
    assert prod_settings.SECURE_CONTENT_TYPE_NOSNIFF is True
    assert prod_settings.X_FRAME_OPTIONS == 'DENY'


def test_allowed_hosts_from_env(prod_settings):
    assert prod_settings.ALLOWED_HOSTS == ['example.com', 'api.example.com']


def test_cors_allowed_origins_from_env(prod_settings):
    assert prod_settings.CORS_ALLOWED_ORIGINS == ['https://app.example.com']


def test_redis_cache_backend(prod_settings):
    assert prod_settings.CACHES['default']['BACKEND'] == 'django.core.cache.backends.redis.RedisCache'
    assert prod_settings.CACHES['default']['LOCATION'] == 'redis://localhost:6379/0'
