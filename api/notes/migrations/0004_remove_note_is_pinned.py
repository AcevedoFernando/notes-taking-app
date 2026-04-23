from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0003_note_created_at'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='note',
            name='is_pinned',
        ),
    ]
