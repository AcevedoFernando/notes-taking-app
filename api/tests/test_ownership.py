import pytest
from rest_framework.exceptions import PermissionDenied
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from notes.models import Note
from notes.services import create_note, update_note
from tests.factories.category import CategoryFactory
from tests.factories.note import NoteFactory
from tests.factories.user import UserFactory


def auth_client(user):
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return client


@pytest.mark.django_db
class TestNotesOwnership:
    def test_owner_can_retrieve_own_note(self):
        user = UserFactory()
        note = NoteFactory(user=user)
        resp = auth_client(user).get(f'/api/notes/{note.pk}/')
        assert resp.status_code == 200

    def test_non_owner_gets_404_via_queryset(self):
        user = UserFactory()
        other = UserFactory()
        note = NoteFactory(user=other)
        resp = auth_client(user).get(f'/api/notes/{note.pk}/')
        assert resp.status_code == 404


@pytest.mark.django_db
class TestCategoriesOwnership:
    def test_owner_can_retrieve_own_category(self):
        user = UserFactory()
        cat = CategoryFactory(user=user)
        resp = auth_client(user).get(f'/api/categories/{cat.pk}/')
        assert resp.status_code == 200

    def test_non_owner_gets_404_via_queryset(self):
        user = UserFactory()
        other = UserFactory()
        cat = CategoryFactory(user=other)
        resp = auth_client(user).get(f'/api/categories/{cat.pk}/')
        assert resp.status_code == 404


@pytest.mark.django_db
class TestServiceCategoryGuard:
    def test_create_note_with_other_users_category_raises(self):
        owner = UserFactory()
        attacker = UserFactory()
        cat = CategoryFactory(user=owner)
        before = Note.objects.count()
        with pytest.raises(PermissionDenied):
            create_note(attacker, {'title': 't', 'category': cat})
        assert Note.objects.count() == before

    def test_create_note_with_own_category_succeeds(self):
        user = UserFactory()
        cat = CategoryFactory(user=user)
        note = create_note(user, {'title': 't', 'category': cat})
        assert note.user_id == user.id
        assert note.category_id == cat.id

    def test_create_note_with_null_category_succeeds(self):
        user = UserFactory()
        note = create_note(user, {'title': 't', 'category': None})
        assert note.user_id == user.id
        assert note.category_id is None

    def test_update_note_with_other_users_category_raises(self):
        owner = UserFactory()
        other = UserFactory()
        note = NoteFactory(user=owner)
        cat_other = CategoryFactory(user=other)
        with pytest.raises(PermissionDenied):
            update_note(note, {'category': cat_other})
