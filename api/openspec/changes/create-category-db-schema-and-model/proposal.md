## Why

Notes need a way to be organized per user. A `Category` model provides the foundational taxonomy layer that lets each user group their own notes by topic, enabling filtering and browsing. Categories are user-scoped — one user's categories are invisible and independent from another's.

## What Changes

- Add `Category` Django model with a user-scoped unique name, a hex color, and a ForeignKey to `User`
- Create and apply the database migration for the new `notes_category` table
- Register the model in Django admin
- (No API endpoints yet — those are a separate change)

## Capabilities

### New Capabilities

- `category-model`: Django ORM model representing a note category, with a user-scoped unique name (`unique_together = ('name', 'user')`), a hex color code (`CharField(7)`), a ForeignKey to `User`, and an `AutoField` PK

### Modified Capabilities

<!-- None — this is the first schema for categories -->

## Impact

- `notes/models.py` — new `Category` model definition
- `notes/admin.py` — register `Category` with Django admin
- `notes/migrations/` — new migration file creating the `notes_category` table
- No API surface changes; serializers/viewsets to be added in a later change
