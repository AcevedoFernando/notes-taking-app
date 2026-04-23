from django.db import transaction

from notes.models import Category

DEFAULT_CATEGORIES = [
    {'name': 'Random Thoughts', 'color': '#EF9C66'},
    {'name': 'School', 'color': '#FCDC94'},
    {'name': 'Personal', 'color': '#78ABA8'},
    {'name': 'Drama', 'color': '#C8CFA0'},
]


def create_default_categories(user):
    with transaction.atomic():
        Category.objects.bulk_create([
            Category(name=cat['name'], color=cat['color'], user=user)
            for cat in DEFAULT_CATEGORIES
        ])
