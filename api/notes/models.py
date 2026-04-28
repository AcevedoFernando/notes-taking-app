import uuid

from django.conf import settings
from django.db import models


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='categories',
    )

    class Meta:
        unique_together = ('name', 'user')

    def __str__(self):
        return self.name


class Note(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notes',
    )
    category = models.ForeignKey(
        'notes.Category',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='notes',
    )
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at'], name='note_user_created_idx'),
            models.Index(fields=['user', 'category'], name='note_user_category_idx'),
        ]

    def __str__(self):
        return self.title
