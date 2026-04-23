import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from tests.factories.category import CategoryFactory
from tests.factories.note import NoteFactory
from tests.factories.user import UserFactory


def auth_client(user):
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return client


NOTES_URL = '/api/notes/'


def note_url(pk):
    return f'/api/notes/{pk}/'


# ---------------------------------------------------------------------------
# List
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestListNotes:
    def test_returns_only_own_notes(self):
        user = UserFactory()
        other = UserFactory()
        NoteFactory.create_batch(3, user=user)
        NoteFactory.create_batch(2, user=other)
        resp = auth_client(user).get(NOTES_URL)
        assert resp.status_code == 200
        assert len(resp.data['results']) == 3

    def test_filter_by_category(self):
        user = UserFactory()
        cat = CategoryFactory(user=user)
        NoteFactory(user=user, category=cat)
        NoteFactory(user=user, category=None)
        resp = auth_client(user).get(NOTES_URL, {'category': cat.pk})
        assert resp.status_code == 200
        assert len(resp.data['results']) == 1
        assert resp.data['results'][0]['category'] == cat.pk

    def test_search_by_title(self):
        user = UserFactory()
        NoteFactory(user=user, title='Django tips')
        NoteFactory(user=user, title='Unrelated note')
        resp = auth_client(user).get(NOTES_URL, {'search': 'django'})
        assert resp.status_code == 200
        assert len(resp.data['results']) == 1
        assert 'django' in resp.data['results'][0]['title'].lower()

    def test_search_by_content(self):
        user = UserFactory()
        NoteFactory(user=user, title='Note A', content='python is great')
        NoteFactory(user=user, title='Note B', content='irrelevant text')
        resp = auth_client(user).get(NOTES_URL, {'search': 'Python'})
        assert resp.status_code == 200
        assert len(resp.data['results']) == 1

    def test_unauthenticated_returns_401(self):
        resp = APIClient().get(NOTES_URL)
        assert resp.status_code == 401

    def test_notes_ordered_by_created_at_desc(self):
        user = UserFactory()
        note_a = NoteFactory(user=user, title='First')
        note_b = NoteFactory(user=user, title='Second')
        resp = auth_client(user).get(NOTES_URL)
        assert resp.status_code == 200
        titles = [n['title'] for n in resp.data['results']]
        assert titles.index('Second') < titles.index('First')


# ---------------------------------------------------------------------------
# Create
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestCreateNote:
    def test_successful_creation_returns_201(self):
        user = UserFactory()
        resp = auth_client(user).post(NOTES_URL, {'title': 'My note', 'content': '<b>Hello</b>'})
        assert resp.status_code == 201
        assert resp.data['title'] == 'My note'
        assert 'id' in resp.data

    def test_missing_title_returns_400(self):
        user = UserFactory()
        resp = auth_client(user).post(NOTES_URL, {'content': 'no title here'})
        assert resp.status_code == 400
        assert resp.data['error'] == 'VALIDATION_ERROR'
        assert 'title' in resp.data['fields']

    def test_xss_script_tag_is_stripped(self):
        user = UserFactory()
        resp = auth_client(user).post(NOTES_URL, {
            'title': 't',
            'content': '<script>alert(1)</script>Safe text',
        })
        assert resp.status_code == 201
        assert '<script>' not in resp.data['content']
        assert 'Safe text' in resp.data['content']

    def test_category_from_other_user_returns_400(self):
        user = UserFactory()
        other = UserFactory()
        cat = CategoryFactory(user=other)
        resp = auth_client(user).post(NOTES_URL, {'title': 'Note', 'category': cat.pk})
        assert resp.status_code == 400
        assert 'category' in resp.data.get('fields', {})

    def test_unauthenticated_returns_401(self):
        resp = APIClient().post(NOTES_URL, {'title': 'x'})
        assert resp.status_code == 401

    def test_note_assigned_to_request_user(self):
        user = UserFactory()
        resp = auth_client(user).post(NOTES_URL, {'title': 'Mine'})
        assert resp.status_code == 201
        assert str(resp.data['user']) == str(user.pk)


# ---------------------------------------------------------------------------
# Retrieve
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestRetrieveNote:
    def test_successful_retrieval_returns_200(self):
        user = UserFactory()
        note = NoteFactory(user=user)
        resp = auth_client(user).get(note_url(note.pk))
        assert resp.status_code == 200
        assert str(resp.data['id']) == str(note.pk)

    def test_other_users_note_returns_404(self):
        user = UserFactory()
        other = UserFactory()
        note = NoteFactory(user=other)
        resp = auth_client(user).get(note_url(note.pk))
        assert resp.status_code == 404

    def test_nonexistent_note_returns_404(self):
        user = UserFactory()
        import uuid
        resp = auth_client(user).get(note_url(uuid.uuid4()))
        assert resp.status_code == 404


# ---------------------------------------------------------------------------
# PUT (full update)
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestUpdateNote:
    def test_successful_full_update_returns_200(self):
        user = UserFactory()
        note = NoteFactory(user=user, title='Old', content='old content')
        resp = auth_client(user).put(note_url(note.pk), {
            'title': 'New Title',
            'content': 'new content',
            'category': None,
        }, format='json')
        assert resp.status_code == 200
        assert resp.data['title'] == 'New Title'

    def test_put_other_users_note_returns_404(self):
        user = UserFactory()
        other = UserFactory()
        note = NoteFactory(user=other)
        resp = auth_client(user).put(note_url(note.pk), {
            'title': 'Hijack',
            'content': '',
            'category': None,
        }, format='json')
        assert resp.status_code == 404


# ---------------------------------------------------------------------------
# PATCH (partial update)
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestPartialUpdateNote:
    def test_update_title_only(self):
        user = UserFactory()
        note = NoteFactory(user=user, title='Original', content='keep this')
        resp = auth_client(user).patch(note_url(note.pk), {'title': 'Updated'})
        assert resp.status_code == 200
        assert resp.data['title'] == 'Updated'
        assert resp.data['content'] == 'keep this'

    def test_patch_other_users_note_returns_404(self):
        user = UserFactory()
        other = UserFactory()
        note = NoteFactory(user=other)
        resp = auth_client(user).patch(note_url(note.pk), {'title': 'Hijack'})
        assert resp.status_code == 404


# ---------------------------------------------------------------------------
# DELETE
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestDeleteNote:
    def test_successful_deletion_returns_204(self):
        user = UserFactory()
        note = NoteFactory(user=user)
        resp = auth_client(user).delete(note_url(note.pk))
        assert resp.status_code == 204

    def test_delete_other_users_note_returns_404(self):
        user = UserFactory()
        other = UserFactory()
        note = NoteFactory(user=other)
        resp = auth_client(user).delete(note_url(note.pk))
        assert resp.status_code == 404

    def test_subsequent_get_after_deletion_returns_404(self):
        user = UserFactory()
        note = NoteFactory(user=user)
        auth_client(user).delete(note_url(note.pk))
        resp = auth_client(user).get(note_url(note.pk))
        assert resp.status_code == 404
