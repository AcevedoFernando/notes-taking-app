## ADDED Requirements

### Requirement: Button renders an outlined brand-colored button
The Button atom SHALL render a button element with an outlined border (`#957139`), text color `#957139`, and transparent background. It SHALL accept a `children` prop for the label text.

#### Scenario: Default button renders
- **WHEN** Button is rendered with label text "Save"
- **THEN** a visible outlined button appears with the label and brand color

### Requirement: Button supports an optional leading icon
The Button atom SHALL accept an optional `icon` prop of type ReactNode. When provided, the icon SHALL appear to the left of the label with consistent spacing.

#### Scenario: Button renders with icon
- **WHEN** Button is rendered with an icon prop set to a Lucide icon component
- **THEN** the icon appears to the left of the label text

#### Scenario: Button renders without icon
- **WHEN** Button is rendered without an icon prop
- **THEN** only the label text is shown with no extra leading space

### Requirement: Button applies hover state at 20% opacity
The Button atom SHALL apply a background color of `#957139` at 20% opacity on hover.

#### Scenario: Hover state is applied
- **WHEN** the user hovers over the Button
- **THEN** the button background transitions to `#957139` at 20% opacity

### Requirement: Button exposes a Storybook story
The Button atom SHALL have a Storybook story covering the default and icon variants.

#### Scenario: Stories render without errors
- **WHEN** Storybook loads the Button stories
- **THEN** both the Default and WithIcon stories render without console errors
