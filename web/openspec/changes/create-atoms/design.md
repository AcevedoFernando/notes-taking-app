## Context

Notes Flow already has a Next.js 14 App Router scaffold with Tailwind CSS configured. No atom-level components exist yet. The design system defines three atoms needed across all pages: Input, Button, and CategoryLabel. All styling relies on brand tokens (`#FAF1E3`, `#88642A`, `#957139`) and the `Inter` / `Inria Serif` font stack.

## Goals / Non-Goals

**Goals:**
- Implement the three atoms (Input, Button, CategoryLabel) as isolated, reusable React components.
- Expose each atom as a Storybook story so designers can verify against the spec.
- Follow Tailwind utility classes exclusively — no inline styles except for dynamic hex values passed as props (e.g., CategoryLabel color dot).

**Non-Goals:**
- Building Molecules or Pages — those depend on these atoms but are out of scope here.
- Form validation or controlled-form wiring — atoms are presentational; callers own state.
- Playwright E2E tests — covered when Molecules/Pages are built.

## Decisions

**Dynamic color via CSS custom properties / inline style**
CategoryLabel receives a `color` hex string prop and applies it to the circle swatch. Tailwind's JIT cannot generate arbitrary hex classes at runtime, so `style={{ backgroundColor: color }}` is the only viable approach. All other styling stays in Tailwind.

**Password visibility toggle lives inside Input**
The eye/eye-off icon toggle is an internal concern of the Input atom. Callers pass `type="password"` and the atom manages `showPassword` state internally, avoiding prop drilling.

**Button icon slot is optional via render prop / ReactNode**
An optional `icon` prop of type `ReactNode` placed before the label keeps the Button atom simple. Callers import the Lucide icon they need; the atom applies consistent sizing and spacing.

**Storybook `staticDirs`**
CONTEXT.md requires `staticDirs: ['../public']` in Storybook config so public assets resolve correctly in stories. This is already enforced in the Storybook setup; no change needed here.

## Risks / Trade-offs

- [Dynamic hex values bypass Tailwind purging] → Only affects the `style` prop on the color dot; all other classes are static and safe.
- [Internal toggle state in Input couples behavior to atom] → Acceptable for this use case; if callers ever need external control they can add a `showPassword` prop later.
