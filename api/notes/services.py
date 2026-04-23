from django.db.models import Count, Q, Model

from notes.models import Category, Note


def _apply_update(instance: Model, validated_data: dict, extra_update_fields: list[str] | None = None) -> Model:
    for attr, value in validated_data.items():
        setattr(instance, attr, value)
    update_fields = [*validated_data.keys(), *(extra_update_fields or [])]
    instance.save(update_fields=update_fields)
    return instance


def get_user_notes(user, filters=None):
    qs = Note.objects.filter(user=user).select_related('category')
    if filters:
        category = filters.get('category')
        if category is not None:
            qs = qs.filter(category_id=category)
        search = filters.get('search')
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(content__icontains=search))
    return qs.order_by('-created_at')


def create_note(user, validated_data: dict) -> Note:
    return Note.objects.create(user=user, **validated_data)


def update_note(instance: Note, validated_data: dict) -> Note:
    return _apply_update(instance, validated_data, extra_update_fields=['updated_at'])


def get_user_categories(user, with_counter: bool = False):
    qs = Category.objects.filter(user=user)
    if with_counter:
        qs = qs.annotate(notes_count=Count('notes'))
    return qs.order_by('name')


def create_category(user, validated_data: dict) -> Category:
    return Category.objects.create(user=user, **validated_data)


def update_category(instance: Category, validated_data: dict) -> Category:
    return _apply_update(instance, validated_data)
