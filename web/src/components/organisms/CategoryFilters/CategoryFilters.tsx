import { memo } from 'react';
import { CategoryLabel } from '../../atoms/CategoryLabel';
import type { Category } from '../../../types';

interface CategoryFiltersProps {
  categories: Category[];
  activeCategoryId: string | null;
  onSelect: (id: string | null) => void;
}

export const CategoryFilters = memo(function CategoryFilters({ categories, activeCategoryId, onSelect }: CategoryFiltersProps) {
  const allActive = activeCategoryId === null;

  return (
    <ul className="flex flex-col gap-2">
      <li>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded text-sm text-[#000000] transition-colors ${allActive ? 'bg-secondary/20 font-bold' : 'hover:bg-secondary/10'}`}
        >
          All Categories
        </button>
      </li>
      {categories.map((cat) => (
        <li key={cat.id}>
          <button
            type="button"
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded text-sm transition-colors ${activeCategoryId === cat.id ? 'bg-secondary/20 font-bold' : 'hover:bg-secondary/10'}`}
          >
            <CategoryLabel name={cat.name} color={cat.color} />
            <span className="ml-auto text-[#000000]">{cat.notes_count}</span>
          </button>
        </li>
      ))}
    </ul>
  );
});
