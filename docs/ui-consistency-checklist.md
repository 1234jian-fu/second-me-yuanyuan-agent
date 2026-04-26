# UI Consistency Checklist

This app follows the current Figma direction until exact frame-level tokens are available.

## Visual Language

- Use `config/theme.ts` tokens for all colors, spacing, radius, shadows, and typography.
- Keep the warm background, white raised cards, muted green primary actions, and soft borders consistent.
- Prefer `Surface`, `PressableSurface`, `AppText`, `PageHeader`, `SectionHeader`, `ActionCard`, and `MetricCard` before creating new one-off layouts.
- Keep primary cards and CTA states low-saturation; do not introduce unrelated accent colors per screen.

## Layout

- Mobile screens use `PageContainer` and stay within `layout.screenMaxWidth`.
- Sections use `spacing.xl` between major blocks and `spacing.md` inside cards/lists.
- Cards use `radius.lg`, `radius.xl`, or `radius.xxl` only. Avoid raw border radius values.
- Touch targets must be at least `layout.touchTarget` where the user can tap.

## Interaction

- Use `Pressable` or `PressableSurface` with visible pressed feedback.
- Keep bottom tabs to five routes: Home, Records, Chat, Plans, Me.
- Add `accessibilityLabel`, `accessibilityRole`, or `accessibilityState` for custom controls.

## Future Figma Integration

- When a specific Figma frame is selected, fetch `get_design_context` for that frame and map exact values into `config/theme.ts`.
- If a Figma component matches an existing React Native component, extend the component rather than duplicating styles in a screen.
- Icons should come from Figma assets or one approved icon set later; do not mix icon families.
