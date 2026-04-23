import factory

from notes.models import Category
from tests.factories.user import UserFactory


class CategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Category

    name = factory.Faker('word')
    color = factory.Faker('hex_color')
    user = factory.SubFactory(UserFactory)
