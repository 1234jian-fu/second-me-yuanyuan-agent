# Mobile Testing

This MVP is a phone-first Expo app. Web support can remain for debugging, but acceptance testing should happen on a physical iOS or Android phone.

## Run On Phone

```powershell
cd C:\codex-clean-test\personal-agent-mvp
npm start
```

Then scan the Expo QR code with Expo Go.

## Real Device Notes

- Recording should be tested on a physical phone, not only on web.
- Expo Go can request microphone permission at runtime.
- Custom native permission text from `app.json` is fully controlled in a development build or production build.
- Supabase-backed flows should be tested with the phone online and `.env` values loaded before Expo starts.
- After changing `.env`, stop and restart Expo.
- Phone and computer should usually be on the same network when using Expo Go.

## Phone-First UI Rules

- Keep the app portrait-first.
- Keep bottom navigation to five tabs.
- Keep tappable controls at least 48 dp.
- Avoid desktop-only layout assumptions.
- Validate keyboard behavior on text-heavy screens.
