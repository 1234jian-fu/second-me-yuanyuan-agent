# Mobile Build

## Current State

- Expo app config is ready for EAS Build.
- Android preview build is configured to produce an `apk`.
- Production build is configured for release builds.

## One-Time Setup

1. Install EAS CLI:

```bash
npm install -g eas-cli
```

2. Login to Expo:

```bash
eas login
```

3. Inside the project:

```bash
cd personal-agent-mvp
```

## Android Preview Build

This is the fastest way to get a phone-installable package.

```bash
npm run build:android:preview
```

## Android Production Build

This creates a release build for publishing.

```bash
npm run build:android:production
```

## iOS Build

Requires an Apple Developer account.

```bash
npm run build:ios:preview
```

or

```bash
npm run build:ios:production
```

## Current Blocker On This Machine

`eas-cli` is installed, but Expo account login is missing.

Current status:

```bash
npx eas-cli whoami
```

returns:

```text
Not logged in
```

After login, builds can be triggered immediately.
