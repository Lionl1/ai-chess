# Google Play Checklist

## 1. App Bundle

- Build signed AAB:
  - `./scripts/build-play-release.sh`
- Artifact:
  - `app/build/outputs/bundle/release/app-release.aab`

## 2. Play Console Setup

- Create app in Play Console (`com.jigo.chessai`).
- Fill app details:
  - App name
  - Default language
  - App category: `Game` -> `Board`
- Set contact email.

## 3. Policy / Forms

- App access: `All or some functionality is restricted` (depends on your backend policy).
- Ads declaration.
- Data safety form.
- Content rating questionnaire.
- Target audience.
- News declaration (usually `No`).

## 4. Store Listing

- Short description (up to 80 chars).
- Full description.
- Screenshots (phone required; tablet optional but recommended).
- App icon (512x512).
- Feature graphic (1024x500).
- Privacy policy URL.

## 5. Release

- Create production release.
- Upload `app-release.aab`.
- Add release notes.
- Review and roll out.

## 6. Post-Release

- Verify install/open on real device.
- Monitor ANR/crash in Android Vitals.
- Increment `versionCode` for every next upload.
