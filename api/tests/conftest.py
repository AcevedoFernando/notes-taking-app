import pytest
from django.core.cache import cache


@pytest.fixture(autouse=True)
def _clear_cache_between_tests():
    """Reset throttle counters and any other cache state between tests.

    DRF throttles persist their counters in `default` cache, which now points
    at Redis. Without this fixture, repeated logins/registrations across the
    test session would trip the `auth` throttle (10/min) and produce 429s.
    """
    cache.clear()
    yield
    cache.clear()
