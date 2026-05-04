# 100Handy Mobile — App Store & Play Store Deployment Checklist

App: **100Handy** · Bundle ID: **com.oxdpr.handy** · Expo project: **baf41b27-5045-4fb4-ad35-c66c9a3d1814**

---

## 0. One-Time Account Setup

### Apple
- [ ] Apple Developer Program membership active ($99/yr) — `app@oxdpr.com`
- [ ] App Store Connect access for `app@oxdpr.com`
- [ ] Bundle ID `com.oxdpr.handy` registered in Apple Developer portal
- [ ] App ID has these capabilities enabled:
  - [ ] Sign in with Apple
  - [ ] Push Notifications
  - [ ] Associated Domains
  - [ ] Apple Pay (merchant ID `merchant.com.oxdpr.handy`)
- [ ] Apple Pay merchant ID `merchant.com.oxdpr.handy` created and linked to Stripe

### Google
- [ ] Google Play Console membership active ($25 one-time)
- [ ] Service account JSON key generated for EAS Submit (Play Console → Setup → API access)
- [ ] App `com.oxdpr.handy` created in Play Console
- [ ] Linked to a Google Cloud project for Maps API billing

### Expo / EAS
- [ ] Logged into EAS CLI as `100handy` owner: `eas whoami`
- [ ] EAS project linked: `apps/client-mobile/app.config.js` has correct `projectId`
- [ ] EAS Submit credentials stored: `eas credentials`

---

## 1. Pre-Flight Code Audit

### Version bumps
- [ ] `app.config.js` → `version` bumped (currently `1.0.0`)
- [ ] `app.config.js` → `ios.buildNumber` bumped (currently `8`) — **must be unique per TestFlight build**
- [ ] `app.config.js` → `android.versionCode` bumped (currently `6`) — **must be higher than last Play submission**

### Production environment
- [ ] Verify `apps/client-mobile/.env.production` (or EAS env vars) has:
  - [ ] `EXPO_PUBLIC_SUPABASE_URL` (production)
  - [ ] `EXPO_PUBLIC_SUPABASE_ANON_KEY` (production)
  - [ ] `EXPO_PUBLIC_SITE_URL=https://www.100handy.com`
  - [ ] `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` (with iOS + Android bundle restrictions)
  - [ ] `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_…` (replace test key)
- [ ] Stripe Connect refresh/return URLs working at `https://100handy.com/connect/refresh` and `/connect/return`
- [ ] No `console.log` of sensitive data
- [ ] Sentry/crash reporting configured (or noted as TODO)

### Universal Links / App Links
- [ ] iOS AASA file hosted at `https://100handy.com/.well-known/apple-app-site-association` and `https://www.100handy.com/.well-known/apple-app-site-association`
  - Content includes app ID `<TeamID>.com.oxdpr.handy` and the paths the app should handle
  - Served as `application/json` with no redirects
- [ ] Android `assetlinks.json` hosted at `https://100handy.com/.well-known/assetlinks.json`
  - Contains SHA-256 fingerprint of the upload key
- [ ] Verify on a device: clicking a `https://www.100handy.com/...` link opens the app

### Web pages referenced from the app must be live
- [ ] `https://www.100handy.com/terms`
- [ ] `https://www.100handy.com/privacy`
- [ ] `https://www.100handy.com/legal`
- [ ] `https://www.100handy.com/help`
- [ ] `https://www.100handy.com/support`
- [ ] `https://www.100handy.com/photo-policy`
- [ ] `https://www.100handy.com/connect/refresh` and `/connect/return`
- [ ] `https://www.100handy.com/referral` (referral landing)

### Final QA on a real device
- [ ] Sign up + sign in (email + Apple)
- [ ] Email verification redirect lands correctly
- [ ] Password reset
- [ ] Booking end-to-end (client side)
- [ ] Stripe Connect onboarding (professional side)
- [ ] Stripe payment for a booking
- [ ] Push notifications (foreground + background + killed)
- [ ] Location permission flow + map autocomplete
- [ ] Camera flow (profile + ID upload)
- [ ] Universal link cold-start + warm-start
- [ ] Deep link `handy://` cold-start

---

## 2. Assets

### Required for both stores
- [ ] App icon `assets/images/icon.png` — 1024×1024, no transparency, no rounded corners
- [ ] Adaptive icon `assets/images/adaptive-icon.png` — Android, 1024×1024
- [ ] Splash `assets/images/splash-icon.png` — at least 200×200, transparent OK

### iOS App Store
- [ ] 6.7" iPhone screenshots — 1290×2796 (3-10 images)
- [ ] 6.5" iPhone screenshots — 1242×2688 (3-10 images)
- [ ] 5.5" iPhone screenshots — 1242×2208 (only required if supporting older devices)
- [ ] App preview video (optional, 15-30s)
- [ ] App Store icon — auto-generated from `icon.png`

### Google Play Store
- [ ] Phone screenshots — at least 1080px on shortest side (2-8 images)
- [ ] Tablet screenshots (optional but recommended for 7" and 10")
- [ ] Feature graphic — 1024×500 PNG/JPG
- [ ] App icon — 512×512 PNG (32-bit with alpha)
- [ ] Promo video URL (optional, YouTube)

---

## 3. Store Listing Content

### Both stores
- [ ] App name: `100Handy`
- [ ] Subtitle / short description (≤30 chars iOS, ≤80 chars Android)
- [ ] Full description (4000 chars)
- [ ] Keywords (iOS, ≤100 chars)
- [ ] Category: Business / Lifestyle (decide)
- [ ] Support URL: `https://www.100handy.com/support`
- [ ] Marketing URL: `https://www.100handy.com`
- [ ] Privacy policy URL: `https://www.100handy.com/privacy`
- [ ] Terms URL: `https://www.100handy.com/terms`

### iOS App Review
- [ ] Demo account credentials (client + professional) for reviewers
- [ ] App Review notes — explain Stripe Connect onboarding, location use, camera use
- [ ] Sign in with Apple working without exception (Apple rejects apps that have other social login but not Sign in with Apple)
- [ ] Age rating questionnaire completed
- [ ] App privacy "nutrition label" — declare data collected (location, contact info, payment info, identifiers)
- [ ] Export compliance — declare uses of encryption (HTTPS only → exempt)

### Google Play
- [ ] Content rating questionnaire (IARC)
- [ ] Target audience (likely 18+)
- [ ] Data safety form — what data is collected, shared, encrypted, deletable
- [ ] App access — provide test credentials if any feature is gated
- [ ] Ads declaration (likely "no ads")
- [ ] Government app declaration (no)
- [ ] News app declaration (no)
- [ ] Financial features declaration — required because of Stripe payments
- [ ] COVID-19 declaration (no)

---

## 4. Build & Submit

### Production build
```bash
cd apps/client-mobile
eas build --platform ios --profile production
eas build --platform android --profile production
```
- [ ] Build succeeds for iOS (`.ipa`)
- [ ] Build succeeds for Android (`.aab`)
- [ ] Test the production build on a device via EAS internal distribution before submitting

### Submit
```bash
eas submit --platform ios --latest
eas submit --platform android --latest
```
- [ ] iOS build appears in App Store Connect → TestFlight
- [ ] Android build appears in Play Console → Internal testing

### Fill in `eas.json` submit profile (currently empty)
```json
"submit": {
  "production": {
    "ios": {
      "appleId": "app@oxdpr.com",
      "ascAppId": "<App Store Connect app ID>",
      "appleTeamId": "<Apple Team ID>"
    },
    "android": {
      "serviceAccountKeyPath": "./google-service-account.json",
      "track": "internal"
    }
  }
}
```
- [ ] Service account JSON in `.gitignore` (do NOT commit)

---

## 5. Pre-Release Testing

### TestFlight (iOS)
- [ ] Build processed (15-60 min)
- [ ] Internal testers added (your team)
- [ ] External testers / beta group (optional, requires Beta Review)
- [ ] Test on at least: latest iOS, iOS minus 1 major version
- [ ] Test on iPhone + iPad (since `supportsTablet: true`)

### Play Console testing tracks
- [ ] Internal testing track (immediate, up to 100 testers)
- [ ] Closed testing → Open testing → Production (gradual rollout)
- [ ] Test on at least: latest Android, Android minus 2 major versions

---

## 6. Submission for Review

### iOS
- [ ] Select TestFlight build for App Store
- [ ] All metadata complete
- [ ] Submit for App Store Review
- [ ] Typical review: 24-48h

### Android
- [ ] Promote internal → production (or send straight to production)
- [ ] All declarations complete
- [ ] Submit for Play Review
- [ ] Typical review: 1-7 days for first release, 24h for updates
- [ ] Staged rollout: start at 20%

---

## 7. Post-Release

- [ ] Monitor Sentry / crash dashboards for first 48h
- [ ] Watch App Store Connect crashes + reviews
- [ ] Watch Play Console ANRs + crashes + reviews
- [ ] Tag the release commit: `git tag v1.0.0 && git push --tags`
- [ ] Create EAS Update channel for OTA updates if applicable
- [ ] Update `version` and bump `buildNumber` / `versionCode` for next iteration

---

## Common Rejection Causes

- **iOS:** Sign in with Apple missing/broken; demo account not provided; privacy nutrition label inaccurate; payment goes through Stripe (must be physical-good service to bypass IAP — confirm 100Handy services qualify as "real-world services" not digital content)
- **Android:** Missing data safety declaration; permissions not justified in description; missing privacy policy; financial features not declared
