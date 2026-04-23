import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from tests.factories.category import CategoryFactory
from tests.factories.note import NoteFactory
from tests.factories.user import UserFactory

CATEGORIES_URL = '/api/categories/'


def auth_client(user):
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return client


def category_url(pk):
    return f'/api/categories/{pk}/'


# ---------------------------------------------------------------------------
# List
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestListCategoriesWithCounter:
    def test_without_param_notes_count_is_null(self):
        user = UserFactory()
        CategoryFactory(user=user)
        resp = auth_client(user).get(CATEGORIES_URL)
        assert resp.status_code == 200
        assert resp.data['results'][0]['notes_count'] is None

    def test_with_counter_returns_correct_count(self):
        user = UserFactory()
        cat = CategoryFactory(user=user)
        NoteFactory.create_batch(3, user=user, category=cat)
        NoteFactory(user=user, category=None)
        resp = auth_client(user).get(CATEGORIES_URL, {'with_counter': 'true'})
        assert resp.status_code == 200
        result = next(c for c in resp.data['results'] if c['id'] == str(cat.pk))
        assert result['notes_count'] == 3

    def test_with_counter_zero_for_empty_category(self):
        user = UserFactory()
        CategoryFactory(user=user)
        resp = auth_client(user).get(CATEGORIES_URL, {'with_counter': 'true'})
        assert resp.status_code == 200
        assert resp.data['results'][0]['notes_count'] == 0


@pytest.mark.django_db
class TestListCategories:
    def test_returns_only_own_categories(self):
        user = UserFactory()
        other = UserFactory()
        CategoryFactory.create_batch(3, user=user)
        CategoryFactory.create_batch(2, user=other)
        resp = auth_client(user).get(CATEGORIES_URL)
        assert resp.status_code == 200
        assert len(resp.data['results']) == 3

    def test_other_users_categories_excluded(self):
        user = UserFactory()
        other = UserFactory()
        CategoryFactory(user=other, name='Hidden')
        resp = auth_client(user).get(CATEGORIES_URL)
        assert resp.status_code == 200
        names = [c['name'] for c in resp.data['results']]
        assert 'Hidden' not in names

    def test_unauthenticated_returns_401(self):
        resp = APIClient().get(CATEGORIES_URL)
        assert resp.status_code == 401


# ---------------------------------------------------------------------------
# Create
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestCreateCategory:
    def test_successful_creation_returns_201_with_id(self):
        user = UserFactory()
        resp = auth_client(user).post(CATEGORIES_URL, {'name': 'Work', 'color': '#FF5733'})
        assert resp.status_code == 201
        assert resp.data['name'] == 'Work'
        assert resp.data['color'] == '#FF5733'
        assert 'id' in resp.data

    def test_missing_name_returns_400(self):
        user = UserFactory()
        resp = auth_client(user).post(CATEGORIES_URL, {'color': '#FF5733'})
        assert resp.status_code == 400
        assert resp.data['error'] == 'VALIDATION_ERROR'
        assert 'name' in resp.data['fields']

    def test_missing_color_returns_400(self):
        user = UserFactory()
        resp = auth_client(user).post(CATEGORIES_URL, {'name': 'Work'})
        assert resp.status_code == 400
        assert resp.data['error'] == 'VALIDATION_ERROR'
        assert 'color' in resp.data['fields']

    def test_duplicate_name_same_user_returns_400(self):
        user = UserFactory()
        CategoryFactory(user=user, name='Work')
        resp = auth_client(user).post(CATEGORIES_URL, {'name': 'Work', 'color': '#123456'})
        assert resp.status_code == 400
        assert resp.data['error'] == 'VALIDATION_ERROR'
        assert 'name' in resp.data['fields']

    def test_same_name_different_users_returns_201(self):
        user1 = UserFactory()
        user2 = UserFactory()
        CategoryFactory(user=user1, name='Work')
        resp = auth_client(user2).post(CATEGORIES_URL, {'name': 'Work', 'color': '#ABCDEF'})
        assert resp.status_code == 201

    def test_unauthenticated_returns_401(self):
        resp = APIClient().post(CATEGORIES_URL, {'name': 'Work', 'color': '#FF5733'})
        assert resp.status_code == 401


# ---------------------------------------------------------------------------
# Retrieve
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestRetrieveCategory:
    def test_successful_retrieval_returns_200(self):
        user = UserFactory()
        cat = CategoryFactory(user=user)
        resp = auth_client(user).get(category_url(cat.pk))
        assert resp.status_code == 200
        assert resp.data['id'] == str(cat.pk)
        assert resp.data['name'] == cat.name

    def test_other_users_category_returns_404(self):
        user = UserFactory()
        other = UserFactory()
        cat = CategoryFactory(user=other)
        resp = auth_client(user).get(category_url(cat.pk))
        assert resp.status_code == 404

    def test_nonexistent_category_returns_404(self):
        import uuid
        user = UserFactory()
        resp = auth_client(user).get(category_url(uuid.uuid4()))
        assert resp.status_code == 404


# ---------------------------------------------------------------------------
# PUT (full update)
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestUpdateCategory:
    def test_successful_full_update_returns_200(self):
        user = UserFactory()
        cat = CategoryFactory(user=user, name='Old', color='#000000')
        resp = auth_client(user).put(
            category_url(cat.pk),
            {'name': 'Renamed', 'color': '#FFFFFF'},
            format='json',
        )
        assert resp.status_code == 200
        assert resp.data['name'] == 'Renamed'
        assert resp.data['color'] == '#FFFFFF'

    def test_put_other_users_category_returns_404(self):
        user = UserFactory()
        other = UserFactory()
        cat = CategoryFactory(user=other)
        resp = auth_client(user).put(
            category_url(cat.pk),
            {'name': 'Hijack', 'color': '#123456'},
            format='json',
        )
        assert resp.status_code == 404

    def test_rename_to_existing_name_returns_400(self):
        user = UserFactory()
        CategoryFactory(user=user, name='Existing')
        cat = CategoryFactory(user=user, name='Current')
        resp = auth_client(user).put(
            category_url(cat.pk),
            {'name': 'Existing', 'color': '#AABBCC'},
            format='json',
        )
        assert resp.status_code == 400
        assert 'name' in resp.data.get('fields', {})

    def test_put_same_name_on_same_instance_succeeds(self):
        user = UserFactory()
        cat = CategoryFactory(user=user, name='MyName', color='#000000')
        resp = auth_client(user).put(
            category_url(cat.pk),
            {'name': 'MyName', 'color': '#FFFFFF'},
            format='json',
        )
        assert resp.status_code == 200


# ---------------------------------------------------------------------------
# PATCH (partial update)
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestPartialUpdateCategory:
    def test_update_color_only_returns_200(self):
        user = UserFactory()
        cat = CategoryFactory(user=user, name='Original', color='#000000')
        resp = auth_client(user).patch(category_url(cat.pk), {'color': '#123456'})
        assert resp.status_code == 200
        assert resp.data['color'] == '#123456'
        assert resp.data['name'] == 'Original'

    def test_patch_other_users_category_returns_404(self):
        user = UserFactory()
        other = UserFactory()
        cat = CategoryFactory(user=other)
        resp = auth_client(user).patch(category_url(cat.pk), {'color': '#AABBCC'})
        assert resp.status_code == 404


# ---------------------------------------------------------------------------
# DELETE
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestDeleteCategory:
    def test_successful_deletion_returns_204(self):
        user = UserFactory()
        cat = CategoryFactory(user=user)
        resp = auth_client(user).delete(category_url(cat.pk))
        assert resp.status_code == 204

    def test_related_notes_nullified_after_deletion(self):
        from notes.models import Note
        user = UserFactory()
        cat = CategoryFactory(user=user)
        note = NoteFactory(user=user, category=cat)
        auth_client(user).delete(category_url(cat.pk))
        note.refresh_from_db()
        assert note.category is None

    def test_delete_other_users_category_returns_404(self):
        user = UserFactory()
        other = UserFactory()
        cat = CategoryFactory(user=other)
        resp = auth_client(user).delete(category_url(cat.pk))
        assert resp.status_code == 404
