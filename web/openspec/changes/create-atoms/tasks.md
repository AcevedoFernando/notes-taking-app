## 1. Input Atom

- [x] 1.1 Create `src/components/atoms/Input/Input.tsx` with outlined styling, `placeholder` prop, and `type` prop support
- [x] 1.2 Implement internal `showPassword` state toggle with Lucide `Eye` / `EyeOff` icons when `type="password"`
- [x] 1.3 Create `src/components/atoms/Input/index.ts` barrel export
- [x] 1.4 Create `src/stories/Input.stories.tsx` with Text and Password variants

## 2. Button Atom

- [x] 2.1 Create `src/components/atoms/Button/Button.tsx` with outlined border, brand color `#957139`, optional `icon: ReactNode` prop
- [x] 2.2 Implement hover state using Tailwind (`hover:bg-secondary/20` or equivalent)
- [x] 2.3 Create `src/components/atoms/Button/index.ts` barrel export
- [x] 2.4 Create `src/stories/Button.stories.tsx` with Default and WithIcon variants

## 3. CategoryLabel Atom

- [x] 3.1 Create `src/components/atoms/CategoryLabel/CategoryLabel.tsx` with inline-flex layout, color circle swatch via `style={{ backgroundColor: color }}`, and `name` label
- [x] 3.2 Create `src/components/atoms/CategoryLabel/index.ts` barrel export
- [x] 3.3 Create `src/stories/CategoryLabel.stories.tsx` with at least two color/name combinations

## 4. Atoms Index

- [x] 4.1 Create or update `src/components/atoms/index.ts` to re-export Input, Button, and CategoryLabel
