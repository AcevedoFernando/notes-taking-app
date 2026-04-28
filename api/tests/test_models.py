from notes.models import Note


def test_note_has_user_created_index():
    names = {idx.name for idx in Note._meta.indexes}
    assert 'note_user_created_idx' in names
    assert 'note_user_category_idx' in names


def test_note_default_ordering_is_created_desc():
    assert Note._meta.ordering == ['-created_at']
