## ADDED Requirements

### Requirement: CategoryLabel renders a color swatch and name
The CategoryLabel atom SHALL render an inline-flex element containing a filled circular swatch and a text label. It SHALL accept a `color` hex string prop and a `name` string prop.

#### Scenario: CategoryLabel renders with color and name
- **WHEN** CategoryLabel is rendered with `color="#4CAF50"` and `name="Work"`
- **THEN** a filled green circle appears to the left of the text "Work"

#### Scenario: Swatch reflects the provided hex color
- **WHEN** CategoryLabel receives a different `color` hex value
- **THEN** the circle swatch changes to match that color

### Requirement: CategoryLabel swatch uses inline style for dynamic color
The CategoryLabel atom SHALL apply the `color` prop as `backgroundColor` via inline style on the swatch element, since arbitrary Tailwind hex classes cannot be generated at runtime.

#### Scenario: Swatch has correct background color
- **WHEN** CategoryLabel is rendered with `color="#957139"`
- **THEN** the swatch element has `style.backgroundColor` equal to `#957139`

### Requirement: CategoryLabel exposes a Storybook story
The CategoryLabel atom SHALL have a Storybook story demonstrating at least two different color/name combinations.

#### Scenario: Stories render without errors
- **WHEN** Storybook loads the CategoryLabel stories
- **THEN** all stories render without console errors
