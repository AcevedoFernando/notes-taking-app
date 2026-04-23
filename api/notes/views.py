from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

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
    pagination_class = None

    def get_queryset(self):
        filters = {
            'category': self.request.query_params.get('category'),
            'search': (self.request.query_params.get('search') or '')[:200] or None,
        }
        return get_user_notes(self.request.user, filters)

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        try:
            page_size = int(request.query_params['page_size'])
            if page_size <= 0:
                raise ValueError
        except (KeyError, ValueError):
            page_size = None

        if page_size:
            try:
                page = max(int(request.query_params.get('page', 1)), 1)
            except ValueError:
                page = 1
            count = qs.count()
            offset = (page - 1) * page_size
            total_pages = max((count + page_size - 1) // page_size, 1)
            serializer = self.get_serializer(qs[offset:offset + page_size], many=True)
            return Response({
                'count': count,
                'next': page + 1 if page < total_pages else None,
                'previous': page - 1 if page > 1 else None,
                'results': serializer.data,
            })

        return Response(self.get_serializer(qs, many=True).data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        note = create_note(request.user, serializer.validated_data)
        out = self.get_serializer(note)
        headers = self.get_success_headers(out.data)
        return Response(out.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_update(self, serializer):
        update_note(serializer.instance, serializer.validated_data)

class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        with_counter = self.request.query_params.get('with_counter', '').lower() in ('true', '1', 'yes')
        return get_user_categories(self.request.user, with_counter=with_counter)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category = create_category(request.user, serializer.validated_data)
        out = self.get_serializer(category)
        headers = self.get_success_headers(out.data)
        return Response(out.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_update(self, serializer):
        update_category(serializer.instance, serializer.validated_data)
