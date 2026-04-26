# Frontend Architecture

This app shell is intentionally split into visual components, screen routes, and state/services.
Figma implementation should mainly replace component styling and layout composition without moving business state into UI files.

## Route Structure

- `app/(tabs)/home.tsx`: overview and quick actions
- `app/(tabs)/records.tsx`: text record plus audio recording/upload flow
- `app/(tabs)/chat.tsx`: current-session chat shell
- `app/(tabs)/plans.tsx`: daily plan shell
- `app/(tabs)/profile.tsx`: profile/settings shell

## UI Components

- `components/PageContainer.tsx`: safe area and page padding
- `components/PageHeader.tsx`: reusable screen heading
- `components/SectionHeader.tsx`: reusable section title block
- `components/ActionCard.tsx`: primary tappable card
- `components/MetricCard.tsx`: compact metric card
- `components/RecordListItem.tsx`: record list row
- `components/BottomTabBar.tsx`: custom tab bar
- `components/AppInput.tsx`: base input
- `components/AppButton.tsx`: base button
- `components/ui/*`: low-level text, stack, surface, and pressable primitives

When applying Figma designs, prefer updating these components first. Only create screen-specific components when a design pattern appears once.

See `docs/ui-consistency-checklist.md` before introducing new UI patterns.

## Figma Source

The current design source is tracked in `config/figma.ts` and documented in `docs/figma-link.md`.

## Backend Source

Supabase setup and the current cloud/local fallback behavior are documented in `docs/backend-setup.md`.
AI proxy and fallback routing are documented in `docs/ai-gateway.md`.

## Mobile Target

This is a phone-first app. Real acceptance testing should follow `docs/mobile-testing.md`.

## State Boundary

- `store/mockAgentStore.ts`: local mock records, plans, and chat messages
- `data/mockData.ts`: initial mock seed data

Screen files should keep temporary input state only, such as text fields and transient status labels.

## Future Backend Boundary

The mock store is temporary. Backend integration should replace store actions with calls into:

- `services/textEntryService.ts`
- `services/audioEntryService.ts`
- `services/chatService.ts`
- `services/planService.ts`
- `services/storageService.ts`
- `services/ai/aiService.ts`

Do not call Supabase or AI providers directly from screen components.
