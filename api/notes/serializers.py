import re

import bleach
from rest_framework import serializers

from notes.models import Category, Note

ALLOWED_TAGS = [
    'a', 'abbr', 'acronym', 'b', 'blockquote', 'br', 'code', 'em',
    'i', 'li', 'ol', 'p', 'pre', 's', 'strong', 'ul',
]
ALLOWED_ATTRIBUTES = {
    'a': ['href', 'title'],
    'abbr': ['title'],
    'acronym': ['title'],
}

HEX_COLOR_RE = re.compile(r'^#[0-9A-Fa-f]{6}$')


class CategorySerializer(serializers.ModelSerializer):
    notes_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'notes_count']
        read_only_fields = ['id']

    def get_notes_count(self, obj):
        return getattr(obj, 'notes_count', None)

    def validate_color(self, value):
        if not HEX_COLOR_RE.match(value):
            raise serializers.ValidationError('Must be a valid hex color in #RRGGBB format.')
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        if not request:
            return attrs
        name = attrs.get('name', getattr(self.instance, 'name', None))
        qs = Category.objects.filter(name=name, user=request.user)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError({'name': ['A category with this name already exists.']})
        return attrs


class NoteSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True, allow_null=True)

    class Meta:
        model = Note
        fields = ['id', 'user', 'category', 'category_name', 'title', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def validate_content(self, value):
        return bleach.clean(value, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRIBUTES, strip=True)

    def validate_category(self, value):
        if value is None:
            return value
        request = self.context.get('request')
        if request and not Category.objects.filter(pk=value.pk, user=request.user).exists():
            raise serializers.ValidationError('Category does not belong to the current user.')
        return value
