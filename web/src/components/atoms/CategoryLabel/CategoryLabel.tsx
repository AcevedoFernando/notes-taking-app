interface CategoryLabelProps {
  name: string;
  color: string;
}

export function CategoryLabel({ name, color }: CategoryLabelProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="text-xs text-[#000000]">{name}</span>
    </span>
  );
}
