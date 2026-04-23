import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from notes.models import Category
from tests.factories.user import UserFactory

User = get_user_model()


@pytest.mark.django_db
class TestUserModel:
    def test_str_returns_email(self):
        user = UserFactory(email='str@example.com')
        assert str(user) == 'str@example.com'

    def test_create_user_requires_email(self):
        with pytest.raises(ValueError, match='Email is required'):
            User.objects.create_user(email='', password='pass')

    def test_create_superuser_sets_staff_and_superuser(self):
        su = User.objects.create_superuser(email='super@example.com', password='pass')
        assert su.is_staff is True
        assert su.is_superuser is True


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def register_url():
    return '/api/auth/register/'


@pytest.fixture
def token_url():
    return '/api/auth/token/'


@pytest.fixture
def refresh_url():
    return '/api/auth/token/refresh/'


@pytest.fixture
def revoke_url():
    return '/api/auth/token/revoke/'


@pytest.mark.django_db
class TestRegistration:
    def test_successful_registration_returns_201_with_tokens_and_user(self, client, register_url):
        resp = client.post(register_url, {'email': 'alice@example.com', 'password': 'securepass'})
        assert resp.status_code == 201
        assert 'access' in resp.data
        assert 'refresh' in resp.data
        assert resp.data['user']['email'] == 'alice@example.com'
        assert 'id' in resp.data['user']

    def test_registration_creates_4_default_categories(self, client, register_url):
        resp = client.post(register_url, {'email': 'bob@example.com', 'password': 'securepass'})
        assert resp.status_code == 201
        from django.contrib.auth import get_user_model
        User = get_user_model()
        user = User.objects.get(email='bob@example.com')
        cats = Category.objects.filter(user=user)
        assert cats.count() == 4
        names = set(cats.values_list('name', flat=True))
        assert names == {'Random Thoughts', 'School', 'Personal', 'Drama'}

    def test_duplicate_email_returns_400(self, client, register_url):
        UserFactory(email='dup@example.com')
        resp = client.post(register_url, {'email': 'dup@example.com', 'password': 'securepass'})
        assert resp.status_code == 400
        assert resp.data['error'] == 'VALIDATION_ERROR'

    def test_short_password_returns_400(self, client, register_url):
        resp = client.post(register_url, {'email': 'short@example.com', 'password': 'abc'})
        assert resp.status_code == 400
        assert resp.data['error'] == 'VALIDATION_ERROR'

    def test_missing_email_returns_400(self, client, register_url):
        resp = client.post(register_url, {'password': 'securepass'})
        assert resp.status_code == 400
        assert 'email' in resp.data.get('fields', {})

    def test_missing_password_returns_400(self, client, register_url):
        resp = client.post(register_url, {'email': 'nopass@example.com'})
        assert resp.status_code == 400
        assert 'password' in resp.data.get('fields', {})


@pytest.mark.django_db
class TestJWTLogin:
    def test_successful_login_returns_tokens(self, client, token_url):
        UserFactory(email='login@example.com')
        resp = client.post(token_url, {'email': 'login@example.com', 'password': 'password123'})
        assert resp.status_code == 200
        assert 'access' in resp.data
        assert 'refresh' in resp.data

    def test_wrong_password_returns_401(self, client, token_url):
        UserFactory(email='wrong@example.com')
        resp = client.post(token_url, {'email': 'wrong@example.com', 'password': 'badpassword'})
        assert resp.status_code == 401
        assert resp.data['error'] == 'AUTHENTICATION_FAILED'

    def test_unknown_email_returns_401(self, client, token_url):
        resp = client.post(token_url, {'email': 'ghost@example.com', 'password': 'password123'})
        assert resp.status_code == 401


@pytest.mark.django_db
class TestJWTRefreshAndRevoke:
    def _get_tokens(self, client, token_url):
        UserFactory(email='tokens@example.com')
        resp = client.post(token_url, {'email': 'tokens@example.com', 'password': 'password123'})
        return resp.data['access'], resp.data['refresh']

    def test_token_refresh_returns_new_access(self, client, token_url, refresh_url):
        _, refresh = self._get_tokens(client, token_url)
        resp = client.post(refresh_url, {'refresh': refresh})
        assert resp.status_code == 200
        assert 'access' in resp.data

    def test_token_revoke_returns_200(self, client, token_url, revoke_url):
        _, refresh = self._get_tokens(client, token_url)
        resp = client.post(revoke_url, {'refresh': refresh})
        assert resp.status_code == 200

    def test_revoked_token_cannot_be_refreshed(self, client, token_url, refresh_url, revoke_url):
        _, refresh = self._get_tokens(client, token_url)
        client.post(revoke_url, {'refresh': refresh})
        resp = client.post(refresh_url, {'refresh': refresh})
        assert resp.status_code == 401

    def test_revoke_invalid_token_returns_401(self, client, revoke_url):
        # simplejwt raises InvalidToken (subclass of AuthenticationFailed) → 401
        resp = client.post(revoke_url, {'refresh': 'not-a-valid-token'})
        assert resp.status_code == 401
