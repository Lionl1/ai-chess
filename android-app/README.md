# Chess AI Android (Google Play Ready)

This folder contains an Android wrapper for your existing `index.html` chess app.
It uses `WebView`, so functionality stays aligned with the web version:

- chess board and timers
- PvP / PvAI / AI-vs-AI modes
- model/API settings
- localStorage ratings/history

## Project Structure

- `app/src/main/java/com/jigo/chessai/MainActivity.kt`: WebView host
- `app/src/main/assets/index.html`: game UI/logic asset
- `app/src/main/res/xml/network_security_config.xml`: cleartext HTTP support
- `app/build.gradle`: syncs root `../index.html` into assets before build
- `keystore.properties`: local signing config (ignored by git)
- `play/*`: Google Play publication templates/checklist

## Signing Config

`app/build.gradle` reads signing settings from `keystore.properties`.

1. Copy:
   - `cp keystore.properties.example keystore.properties`
2. Fill real upload key values:
   - `storeFile`
   - `storePassword`
   - `keyAlias`
   - `keyPassword`

Optional: generate a new upload keystore:

- `./scripts/create-upload-keystore.sh`

## Build

### Debug APK

- `gradle -p . assembleDebug`
- output: `app/build/outputs/apk/debug/app-debug.apk`

### Release AAB (for Google Play)

- `./scripts/build-play-release.sh`
- output: `app/build/outputs/bundle/release/app-release.aab`

### Release APK (manual install)

- `gradle -p . assembleRelease`
- output: `app/build/outputs/apk/release/app-release-unsigned.apk`

## Google Play

- Checklist: `play/PLAY_CONSOLE_CHECKLIST.md`
- Store texts: `play/STORE_TEXT_TEMPLATE.md`
- Release notes: `play/RELEASE_NOTES_TEMPLATE.md`

## Notes

- `android:usesCleartextTraffic="true"` enabled, so HTTP API URLs can work.
- Clipboard copy in history supports both browser Clipboard API and Android bridge fallback.
- For each next upload to Google Play, increment `versionCode` in `app/build.gradle`.
