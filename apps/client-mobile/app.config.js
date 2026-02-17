// Enable web server output only when explicitly requested (e.g., EXPO_WEB_SSR=true)
// This prevents native builds from trying to bundle server-side code
const enableWebServerOutput = process.env.EXPO_WEB_SSR === 'true';

module.exports = {
  expo: {
    owner: '100handy',
    name: '100Handy',
    slug: '100handy',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'handy',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    extra: {
      eas: {
        projectId: 'baf41b27-5045-4fb4-ad35-c66c9a3d1814',
      },
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.oxdpr.handy',
      buildNumber: '3',
      // TODO: Replace with actual production domain for Universal Links
      associatedDomains: ['applinks:auth.yourdomain.com'],
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'We need your location to help you set your work area and find nearby jobs.',
        NSCameraUsageDescription:
          'We need camera access to take photos of your identity documents and profile pictures.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: 'com.oxdpr.handy',
      permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION', 'POST_NOTIFICATIONS', 'CAMERA'],
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
        },
      },
      intentFilters: [
        {
          action: 'VIEW',
          data: [
            {
              scheme: 'handy',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    web: {
      bundler: 'metro',
      // Only enable server output when explicitly requested via EXPO_WEB_SSR=true
      ...(enableWebServerOutput ? { output: 'server' } : {}),
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-notifications',
      'expo-secure-store',
      'expo-web-browser',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'We need your location to help you set your work area and find nearby jobs.',
        },
      ],
      [
        '@stripe/stripe-react-native',
        {
          merchantIdentifier: 'merchant.com.oxdpr.handy',
          enableGooglePay: true,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
