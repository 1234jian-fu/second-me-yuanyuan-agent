# Figma Link

Design source:

- File: `digital-human`
- File key: `ytK9sG11PAiTuAdunWaAZt`
- Root node: `0:1`
- URL: `https://www.figma.com/design/ytK9sG11PAiTuAdunWaAZt/%E6%95%B0%E5%AD%97%E4%BA%BA?node-id=0-1&t=NiG3y8OwkDWcjSlm-1`

## Current Status

The design source is linked in code at `config/figma.ts`.

The Figma MCP reader can currently capture the root canvas screenshot, but `get_design_context`
for node `0:1` still asks for a selected layer. This means exact frame-level layout tokens are
not available yet.

```text
You currently have nothing selected. You need to select a layer first before using this tool.
```

Current implementation uses the visual screenshot as the reference and maps the shared visual
language into `config/theme.ts` plus reusable components.

## Implementation Mapping

Routes:

- `Home`: `app/(tabs)/home.tsx`
- `Records`: `app/(tabs)/records.tsx`
- `Chat`: `app/(tabs)/chat.tsx`
- `Plans`: `app/(tabs)/plans.tsx`
- `Me`: `app/(tabs)/profile.tsx`

Components to replace from Figma:

- `PageContainer`: page safe area and spacing shell
- `SectionHeader`: section title and helper text
- `ActionCard`: primary card pattern
- `RecordListItem`: record row pattern
- `BottomTabBar`: mobile tab navigation
- `PageHeader`: consistent screen heading
- `MetricCard`: compact stats card
- `components/ui/*`: base text, stack, surface, and pressable surface primitives

## Next Implementation Rule

Keep Zustand state and service boundaries intact. Apply Figma changes by replacing component styling and screen composition, not by moving business state into visual components.

For exact Figma parity, select a specific mobile frame in Figma and rerun `get_design_context`
for that frame node.
