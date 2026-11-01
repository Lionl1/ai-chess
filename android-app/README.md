# Chess AI Android (Google Play Ready)

This folder contains an Android wrapper for the `index.html` chess app in the repository root.
It uses `WebView`, so functionality stays aligned with the web version:

- chess board and timers
- PvP / PvAI / AI-vs-AI modes
- model/API settings
- localStorage ratings/history

## Project Structure

- `app/src/main/java/com/jigo/chessai/MainActivity.kt`: WebView host
- `app/src/main/assets/index.html`: game UI/logic asset, copied from `../index.html` on every build (not tracked in git)
- `app/src/main/res/xml/network_security_config.xml`: cleartext HTTP support
- `app/build.gradle`: syncs root `../index.html` into assets before build
- `keystore.properties`: local signing config (ignored by git)
- `play/*`: Google Play publication templates/checklist

## Requirements

- JDK 17+ (`JAVA_HOME`)
- Android SDK with platform 34 (`ANDROID_HOME`, e.g. `~/Library/Android/sdk`)
- Gradle comes with the wrapper (`./gradlew`), no global install needed

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

- `./scripts/create-upload-keystore.sh` (creates `upload-keystore.jks` in this folder)

`storeFile` is resolved relative to `app/`, so a keystore in this folder is `../upload-keystore.jks`.
Keystores and `keystore.properties` are ignored by git: keep a backup of the upload key outside the repository.

## Build

### Debug APK

- `./gradlew assembleDebug`
- output: `app/build/outputs/apk/debug/app-debug.apk`

### Release AAB (for Google Play)

- `./scripts/build-play-release.sh`
- output: `app/build/outputs/bundle/release/app-release.aab`

### Release APK (manual install)

- `./gradlew assembleRelease`
- output: `app/build/outputs/apk/release/app-release.apk` (signed when `keystore.properties` is set, otherwise `app-release-unsigned.apk`)

## Google Play

- Checklist: `play/PLAY_CONSOLE_CHECKLIST.md`
- Store texts: `play/STORE_TEXT_TEMPLATE.md`
- Release notes: `play/RELEASE_NOTES_TEMPLATE.md`

## Notes

- `android:usesCleartextTraffic="true"` enabled, so HTTP API URLs can work.
- Clipboard copy in history supports both browser Clipboard API and Android bridge fallback.
- For each next upload to Google Play, increment `versionCode` in `app/build.gradle`.
