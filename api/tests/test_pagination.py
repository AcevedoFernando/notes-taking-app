import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from tests.factories.note import NoteFactory
from tests.factories.user import UserFactory

NOTES_URL = '/api/notes/'


def auth_client(user):
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return client


@pytest.mark.django_db
class TestNotesPagination:
    def test_envelope_shape(self):
        user = UserFactory()
        NoteFactory.create_batch(3, user=user)
        resp = auth_client(user).get(NOTES_URL)
        assert resp.status_code == 200
        assert set(resp.data.keys()) >= {'count', 'next', 'previous', 'results'}
        assert resp.data['count'] == 3
        assert resp.data['previous'] is None
        assert resp.data['next'] is None

    def test_default_page_size_is_50(self):
        user = UserFactory()
        NoteFactory.create_batch(60, user=user)
        resp = auth_client(user).get(NOTES_URL)
        assert resp.status_code == 200
        assert resp.data['count'] == 60
        assert len(resp.data['results']) == 50
        assert resp.data['next'] is not None

    def test_page_size_query_param_works(self):
        user = UserFactory()
        NoteFactory.create_batch(10, user=user)
        resp = auth_client(user).get(NOTES_URL, {'page_size': 5})
        assert resp.status_code == 200
        assert len(resp.data['results']) == 5
        assert resp.data['next'] is not None

    def test_page_size_is_capped_at_max(self):
        user = UserFactory()
        NoteFactory.create_batch(120, user=user)
        resp = auth_client(user).get(NOTES_URL, {'page_size': 500})
        assert resp.status_code == 200
        # NotesPagination.max_page_size = 100
        assert len(resp.data['results']) == 100

    def test_second_page_has_previous(self):
        user = UserFactory()
        NoteFactory.create_batch(60, user=user)
        resp = auth_client(user).get(NOTES_URL, {'page': 2})
        assert resp.status_code == 200
        assert resp.data['previous'] is not None
