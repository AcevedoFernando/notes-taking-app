# Project Context: Notes Flow (Frontend)

## 1. Executive Summary
**Objective:** High-fidelity user interface for the "Notes Flow" application.
**Core Stack:**
- **Framework:** Next.js 14+ (App Router).
- **Styling:** Tailwind CSS (configured with custom design tokens).
- **Icons:** Lucide React (Outlined style).
- **State Management:** React Context or Zustand for Auth and Filtering logic.
- **Documentation:** Storybook (Component isolation).
- **Testing:** Playwright (E2E flows).

## 2. Design System & Tokens

### Color Palette
- **Primary Background:** `#FAF1E3`
- **Titles/Headings:** `#88642A`
- **Outlines/Borders:** `#957139`
- **Button Text/Icons:** `#957139`
- **Empty State Labels:** `#88642A`
- **Interaction (Hover):** `#957139` with 20% opacity.

### Typography
- **Main Page Titles:** `48px`, Weight 700 (Bold), Color `#88642A`.
- **Note Titles:** `Inria Serif`, `24px`, Weight 700 (Bold).
- **Body/General Text:** `Inter`, `12px`, Weight 400 (Regular).
- **Metadata (Dates/Category):** `Inter`, `12px`, Weight 400/700.

## 3. Pages & Routing

### Auth Flow (Centered Layout)
- **`/auth/login` (Entry View):**
    - **Asset:** `/public/images/Cat.png`.
    - **Title:** "Yay, New Friend!".
    - **Inputs:** Email, Password (with eye icon toggle).
    - **Action:** Button "SignUp".
    - **Navigation:** Link "We’re already friends!" -> Redirect to Login.
- **`/auth/sign-up` (Registration View):**
    - **Asset:** `/public/images/cactus.png`.
    - **Title:** "Yay, You’re Back!".
    - **Inputs:** Email, Password (with eye icon toggle).
    - **Action:** Button "LogIn".
    - **Navigation:** Link "Oops! I’ve never been here before" -> Redirect to Sign-Up.

### Main Application
- **`/home` (Dashboard):**
    - **Layout:** Two-column split.
    - **Sidebar (25%):** "New Note" Button (Plus Icon) + `CategoryFilters` list.
    - **Main Content (75%):** `NotesList` in a 3-column grid.

## 4. Component Architecture

### Atoms
- **Input:** Outlined, supports custom placeholders and password visibility toggle.
- **Button:** Outlined, color `#957139`, optional icon at start, hover state at 20% opacity.
- **CategoryLabel:** Inline flex, filled color circle + category name.

### Molecules
- **NoteItem:**
    - **Dimensions:** 303px x 246px.
    - **Style:** 11px Rounded corners, 3px Border (`Note.color`), Background (`Note.color` at 50% opacity).
    - **Shadow:** `1px 1px 2px 0px #00000040`.
    - **Typography:** Title (`Inria Serif`, 24px), Content (HTML), `updated_at` (Inter, Bold, 12px), `category_name` (Inter, Regular, 12px).
- **NotesList:**
    - **Empty State:** Image `/public/images/coffee.png`, Label "I’m just here waiting for your charming notes…".
    - **Grid:** 3 notes per row (Vertical flow).
- **NoteEditorModal:**
    - **Dimensions:** 1199px x 700px, 64px interior margin.
    - **Features:** `CategoryDropdown` (Outlined, chevron icon), Text Editor (Plain text + lists support).
    - **Design:** Matches `NoteItem` style (3px Border/BG based on selected category).

## 5. Technical Requirements

### Data & State
- **Entities:** Interfaces must match Backend models (`Note`, `Category`, `UserTokens`).
- **Sanitization:** Safely render HTML content for note body.
- **Reactivity:** Category filters must update the `NotesList` instantly.

### Quality Assurance
- **Storybook:** Required for all Atoms and Molecules. Must use `staticDirs: ['../public']`.
- **Playwright:** E2E coverage for Auth flows and Note creation/filtering.

## 6. Instructions for AI Assistant (Claude)
1. **Tailwind Config:** Extend `tailwind.config.js` with the specific hex codes and fonts (`Inria Serif`, `Inter`).
2. **Dynamic Styling:** Implement dynamic background/border colors for notes based on category hex values + opacity.
3. **Architecture:** Maintain a strict Atomic Design hierarchy.
4. **UX:** Ensure accessibility (aria-labels) and clear focus states using `#957139`.

## 7. Testing & Documentation (Storybook & Playwright)

### Storybook: Desarrollo Dirigido por Componentes (CDD)
- **Alcance:** Todos los Átomos y Moléculas deben contar con sus respectivas historias documentadas.
- **Aislamiento:** Los componentes deben desarrollarse y probarse visualmente en aislamiento, utilizando datos simulados (mocks) para las categorías y notas.
- **Configuración de Assets:** Se debe utilizar la configuración `staticDirs: ['../public/']` para que Storybook pueda renderizar correctamente las imágenes de la marca (`Cat.png`, `cactus.png`, `coffee.png`).
- **Validación de Estados:** Cada historia debe documentar los estados visuales críticos: hover, carga (loading), error y estados vacíos.

### Playwright: Pruebas de Extremo a Extremo (E2E)
- **Flujos Críticos:** Automatización del "Happy Path" del usuario: 
    1. Registro de nuevo usuario.
    2. Inicio de sesión (Login).
    3. Creación de una nota con asignación de categoría.
    4. Filtrado de notas por categoría en el Dashboard.
- **Interaction Testing:** Uso de Playwright para ejecutar pruebas de interacción dentro de las historias de Storybook, asegurando que los componentes reaccionen correctamente a clics y entradas de teclado.
- **Regresión Visual:** Implementación de comparativas de capturas de pantalla para los componentes complejos como `NoteItem` y `NoteEditorModal`, garantizando que cambios en el CSS global no afecten la consistencia visual.
- **Compatibilidad:** Verificación del funcionamiento correcto en múltiples motores de búsqueda (Chromium, Firefox y WebKit).
