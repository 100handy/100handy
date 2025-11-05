# Google Maps Setup for React Native Maps

This guide explains how to set up Google Maps for the work area feature on Android. iOS uses Apple Maps by default and doesn't require an API key.

## Prerequisites

- Google Cloud Platform account
- Google Maps SDK for Android enabled

## Setup Steps

### 1. Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS (optional, for consistency)
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key
6. **Important:** Restrict your API key:
   - Click on the API key to edit
   - Under **Application restrictions**, select **Android apps**
   - Add your package name: `com.yourco.handy`
   - Add your SHA-1 certificate fingerprint (see below)

### 2. Get SHA-1 Certificate Fingerprint

For development:
```bash
# On macOS/Linux
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# On Windows
keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
```

Copy the SHA-1 fingerprint and add it to your API key restrictions.

### 3. Add API Key to Environment Variables

1. Copy `.env.local.example` to `.env.local` if you haven't already:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Google Maps API key to `.env.local`:
   ```
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

### 4. Rebuild the App

After adding the API key, you need to rebuild the native code:

```bash
# Clear Metro cache
pnpm dev --clear

# For development builds
npx expo prebuild --clean

# Run on Android
pnpm android

# Run on iOS
pnpm ios
```

## Testing the Work Area Feature

1. Navigate to Professional Dashboard
2. Tap "Set work area" in the onboarding tasks
3. Allow location permissions when prompted
4. The map should load with your current location
5. Drag the map to select your work area center
6. Adjust the radius using the slider or +/- buttons
7. Tap "Save Work Area"

## Troubleshooting

### Map shows blank/gray screen on Android

**Cause:** API key not configured or restricted incorrectly

**Solution:**
- Verify your API key is in `.env.local`
- Check that Maps SDK for Android is enabled in Google Cloud Console
- Verify your SHA-1 certificate fingerprint is added to API key restrictions
- Rebuild the app with `npx expo prebuild --clean`

### "Authorization failure" error

**Cause:** API key restrictions don't match your app

**Solution:**
- Check package name matches: `com.yourco.handy`
- Add correct SHA-1 fingerprint (debug key for development)
- For production, add the release key fingerprint

### Location permission denied

**Solution:**
- Manually enable location permissions in device settings
- Go to Settings → Apps → 100Handy → Permissions → Location → Allow

## iOS Configuration

iOS uses Apple Maps by default and doesn't require a Google Maps API key. However, you still need to:

1. Ensure location permission is requested (already configured in `app.config.js`)
2. Test on a physical device or simulator with location enabled

## Environment Variables

The app uses the following environment variable for maps:

- `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key for Android

This is configured in `app.config.js` and will be bundled into the native app during prebuild.

## Production Deployment

Before deploying to production:

1. Generate a release keystore for Android
2. Get the SHA-1 fingerprint of your release key
3. Add the release SHA-1 to your API key restrictions
4. Consider using a different API key for production
5. Set up API key usage limits and quotas in Google Cloud Console

## Additional Resources

- [React Native Maps Documentation](https://github.com/react-native-maps/react-native-maps)
- [Google Maps Platform](https://developers.google.com/maps/documentation/android-sdk/get-api-key)
- [Expo Location Documentation](https://docs.expo.dev/versions/latest/sdk/location/)
