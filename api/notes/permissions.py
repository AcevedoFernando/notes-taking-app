from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """Object-level guard: the requesting user must own the resource."""

    def has_object_permission(self, request, view, obj):
        return getattr(obj, 'user_id', None) == request.user.id
