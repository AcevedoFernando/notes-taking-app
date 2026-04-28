from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from notes.pagination import NotesPagination
from notes.permissions import IsOwner
from notes.serializers import CategorySerializer, NoteSerializer
from notes.services import (
    create_category,
    create_note,
    get_user_categories,
    get_user_notes,
    update_category,
    update_note,
)


class NoteViewSet(ModelViewSet):
    serializer_class = NoteSerializer
    pagination_class = NotesPagination
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        filters = {
            'category': self.request.query_params.get('category'),
            'search': (self.request.query_params.get('search') or '')[:200] or None,
        }
        return get_user_notes(self.request.user, filters)

    def perform_create(self, serializer):
        serializer.instance = create_note(self.request.user, serializer.validated_data)

    def perform_update(self, serializer):
        update_note(serializer.instance, serializer.validated_data)


class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        with_counter = self.request.query_params.get('with_counter', '').lower() in ('true', '1', 'yes')
        return get_user_categories(self.request.user, with_counter=with_counter)

    def perform_create(self, serializer):
        serializer.instance = create_category(self.request.user, serializer.validated_data)

    def perform_update(self, serializer):
        update_category(serializer.instance, serializer.validated_data)
