## ADDED Requirements

### Requirement: Input renders an outlined text field
The Input atom SHALL render a single-line text field with an outlined border style using brand color `#957139` and background `#FAF1E3`. It SHALL accept a `placeholder` prop displayed as hint text.

#### Scenario: Default text input renders
- **WHEN** Input is rendered with `type="text"` and `placeholder="Enter value"`
- **THEN** a visible outlined input field appears with the placeholder text and brand-colored border

#### Scenario: Custom placeholder is displayed
- **WHEN** Input receives a non-empty `placeholder` prop
- **THEN** the placeholder text is shown inside the field when the field is empty

### Requirement: Input supports password type with visibility toggle
The Input atom SHALL render an eye/eye-off icon button when `type="password"` is passed. Clicking the icon SHALL toggle the input between masked and unmasked text.

#### Scenario: Password input starts masked
- **WHEN** Input is rendered with `type="password"`
- **THEN** the field value is obscured and an eye icon is visible

#### Scenario: Toggle reveals password
- **WHEN** the user clicks the eye icon on a password Input
- **THEN** the field value becomes visible and the icon changes to eye-off

#### Scenario: Toggle hides password again
- **WHEN** the user clicks the eye-off icon on a visible-password Input
- **THEN** the field value is re-obscured and the icon reverts to eye

### Requirement: Input exposes a Storybook story
The Input atom SHALL have a Storybook story covering the text and password variants.

#### Scenario: Stories render without errors
- **WHEN** Storybook loads the Input stories
- **THEN** both the Text and Password stories render without console errors
