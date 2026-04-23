import pytest
from django.db import IntegrityError

from notes.models import Category
from tests.factories.category import CategoryFactory
from tests.factories.user import UserFactory


@pytest.mark.django_db
class TestCategoryCreation:
    def test_create_category_with_required_fields(self):
        category = CategoryFactory(name='Personal', color='#78ABA8')
        assert category.pk is not None
        assert category.name == 'Personal'
        assert category.color == '#78ABA8'
        assert category.user is not None

    def test_category_id_is_uuid(self):
        import uuid
        category = CategoryFactory()
        assert isinstance(category.id, uuid.UUID)

    def test_str_returns_name(self):
        category = CategoryFactory(name='School')
        assert str(category) == 'School'


@pytest.mark.django_db
class TestCategoryUniqueness:
    def test_duplicate_name_same_user_raises_integrity_error(self):
        user = UserFactory()
        CategoryFactory(name='Personal', user=user)
        with pytest.raises(IntegrityError):
            CategoryFactory(name='Personal', user=user)

    def test_same_name_different_users_is_allowed(self):
        user_a = UserFactory()
        user_b = UserFactory()
        cat_a = CategoryFactory(name='Personal', user=user_a)
        cat_b = CategoryFactory(name='Personal', user=user_b)
        assert cat_a.pk != cat_b.pk


@pytest.mark.django_db
class TestCategoryCascadeDelete:
    def test_deleting_user_cascade_deletes_categories(self):
        user = UserFactory()
        CategoryFactory.create_batch(3, user=user)
        assert Category.objects.filter(user=user).count() == 3
        user.delete()
        assert Category.objects.filter(user_id=user.pk).count() == 0
