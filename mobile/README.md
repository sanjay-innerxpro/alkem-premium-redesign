# Mobile app (React Native / Expo)

A native Android app (iOS-ready) built with [Expo](https://expo.dev) and Expo Router. It shows the same published content as the website, in English, Hindi and Urdu, using the website's public JSON API. Everything editable in the Content Studio, including the brand name, appears in the app without an app update. The last loaded content is saved on the phone, so the app keeps working offline.

| Screen | Content |
| --- | --- |
| Home | Hero, key figures, therapy areas, offerings, About story |
| Products | Search and therapy-area filters; product details with composition, form and pack size |
| News, Careers | Published stories and open roles |
| Contact | Email, phone, address, social links, and the enquiry form (saved to the Content Studio inbox) |
| Detail | Any product, therapy area, offering, page, story or role, with an enquiry shortcut |

## How it connects to the website

- **Content:** `GET /api/public/site?lang=…` returns settings and interface text. `GET /api/public/{products|therapies|offerings|news|careers|pages}[/{slug}]?lang=…` returns published content. See `src/lib/public-api.ts` in the website.
- **Enquiries:** posted to the website's `/api/enquiries`, with the same validation and rate limits as the website form.
- **Shared code:** types are imported from the website (`../src/lib/types.ts`, `../src/lib/i18n.ts`), and interface text comes from the website's translations.
- **Settings:** the website domain, app name and Play Store ID are read from `../android/gradle.properties` (`twa.host`, `twa.appName`, `twa.applicationId`). Icons come from the website via `npm run android:icons` in the project root.

## Develop

```sh
cd mobile
npm install --legacy-peer-deps
npx expo start            # scan the QR code with a development build, or press a for an Android device
npm run typecheck
```

`--legacy-peer-deps` works around a harmless `react`/`react-dom` peer-version mismatch in SDK 58.

## Build an APK or Play Store bundle

Either build in the cloud with EAS (`npx eas-cli@latest build -p android`, needs a free Expo account), or build locally. Locally you need JDK 17 or 21 and the Android SDK:

```sh
npx expo prebuild --platform android      # generates android/ (not committed)
cd android
./gradlew assembleRelease                 # APK for testing: app/build/outputs/apk/release/
./gradlew bundleRelease                   # Play Store bundle: app/build/outputs/bundle/release/
```

Local release builds are signed with the debug key unless you configure your upload key. For the Play Store, use the same upload key and `com.nexpharm.healthcare` ID as the web-wrapper app in `../android/`. This app then ships as its next version: `versionCode` is set one higher automatically.
