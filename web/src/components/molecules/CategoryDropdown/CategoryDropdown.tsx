'use client';

import { memo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CategoryLabel } from '../../atoms/CategoryLabel';
import type { Category } from '../../../types';

interface CategoryDropdownProps {
  categories: Category[];
  selected: Category | null;
  onChange: (category: Category) => void;
}

export const CategoryDropdown = memo(function CategoryDropdown({ categories, selected, onChange }: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 border border-secondary text-secondary text-xs px-3 py-1.5 rounded w-[180px]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <CategoryLabel
          name={(selected || categories[0]).name}
          color={(selected || categories[0]).color}
        />
        <ChevronDown className="ml-auto" size={14} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-full left-0 mt-1 z-10 bg-base border border-secondary rounded shadow-md min-w-[160px]"
        >
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                role="option"
                aria-selected={selected?.id === cat.id}
                onClick={() => { onChange(cat); setOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-secondary/10"
              >
                <CategoryLabel name={cat.name} color={cat.color} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
