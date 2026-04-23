import uuid

import pytest

from notes.models import Note
from tests.factories.category import CategoryFactory
from tests.factories.note import NoteFactory
from tests.factories.user import UserFactory


@pytest.mark.django_db
class TestNoteCreation:
    def test_create_note_without_category(self):
        note = NoteFactory(title='My Note', content='Some content')
        assert note.pk is not None
        assert note.title == 'My Note'
        assert note.content == 'Some content'
        assert note.category is None

    def test_note_id_is_uuid(self):
        note = NoteFactory()
        assert isinstance(note.id, uuid.UUID)

    def test_str_returns_title(self):
        note = NoteFactory(title='Shopping List')
        assert str(note) == 'Shopping List'

    def test_create_note_with_category(self):
        user = UserFactory()
        category = CategoryFactory(user=user)
        note = NoteFactory(user=user, category=category)
        assert note.category == category


@pytest.mark.django_db
class TestNoteForeignKeys:
    def test_deleting_category_nullifies_note_category(self):
        user = UserFactory()
        category = CategoryFactory(user=user)
        note = NoteFactory(user=user, category=category)
        category.delete()
        note.refresh_from_db()
        assert note.category is None

    def test_deleting_user_cascade_deletes_notes(self):
        user = UserFactory()
        NoteFactory.create_batch(3, user=user)
        assert Note.objects.filter(user=user).count() == 3
        user.delete()
        assert Note.objects.filter(user_id=user.pk).count() == 0
