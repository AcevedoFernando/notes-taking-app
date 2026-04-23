import factory

from notes.models import Note
from tests.factories.user import UserFactory


class NoteFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Note

    user = factory.SubFactory(UserFactory)
    category = None
    title = factory.Faker('sentence', nb_words=5)
    content = factory.Faker('paragraph')

