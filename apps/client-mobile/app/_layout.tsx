import "@/globals.css";
import { SplashScreen, Stack, router } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";
import * as Linking from "expo-linking";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { supabase } from "@shared/supabase/supabaseClient";
import { useAuthStore, upsertDevicePushToken } from "@shared/supabase";
import { QueryProvider } from "@/components/providers";
import { ToastProvider } from "@/components/ui/toast";
import { StripeProviderWrapper } from "@/components/StripeProviderWrapper";
import { initializePendingBookingStorage } from "@/lib/pending-booking-storage";
import * as Notifications from "expo-notifications";
import {
  configureNotifications,
  getRouteFromNotificationData,
  registerForPushNotificationsAsync,
} from "@/lib/notifications";

// Initialize pending booking storage with AsyncStorage
initializePendingBookingStorage();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const cleanupAuth = useAuthStore((state) => state.cleanup);
  const setCurrentPushToken = useAuthStore((state) => state.setCurrentPushToken);
  const [fontsLoaded, fontError] = useFonts({
    "Futura-Medium": require("../assets/fonts/futura-medium.ttf"),
    "SourceCodeProVariable": require("../assets/fonts/SourceCodePro-Regular.ttf"),
    // WorkSans font family
    "WorkSans-Regular": require("../assets/fonts/WorkSans-Regular.ttf"),
    "WorkSans-Medium": require("../assets/fonts/WorkSans-Medium.ttf"),
    "WorkSans-SemiBold": require("../assets/fonts/WorkSans-SemiBold.ttf"),
    "WorkSans-Bold": require("../assets/fonts/WorkSans-Bold.ttf"),
    // Cardo font family
    "Cardo-Regular": require("../assets/fonts/Cardo-Regular.ttf"),
    "Cardo-Bold": require("../assets/fonts/Cardo-Bold.ttf"),
    "Cardo-Italic": require("../assets/fonts/Cardo-Italic.ttf"),
  });

  useEffect(() => {
    initializeAuth();

    return () => {
      cleanupAuth();
    };
  }, [cleanupAuth, initializeAuth]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned)
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const userId = useAuthStore((state) => state.user?.id);
  const lastRegisteredUserIdRef = useRef<string | null>(null);
  const lastRegisteredTokenRef = useRef<string | null>(null);

  // Push notifications: configure handlers, handle taps, and register device token (once per user/device).
  useEffect(() => {
    configureNotifications();

    const responseSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const route = getRouteFromNotificationData(
          response.notification.request.content.data
        );
        if (route) {
          router.push(route as Parameters<typeof router.push>[0]);
        }
      }
    );

    // Handle cold start / backgrounded app tap.
    (async () => {
      const lastResponse = await Notifications.getLastNotificationResponseAsync();
      if (!lastResponse) return;
      const route = getRouteFromNotificationData(
        lastResponse.notification.request.content.data
      );
      if (route) {
        router.push(route as Parameters<typeof router.push>[0]);
      }
    })();

    return () => {
      responseSub.remove();
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const register = async () => {
      if (!userId) {
        setCurrentPushToken(null);
        lastRegisteredUserIdRef.current = null;
        lastRegisteredTokenRef.current = null;
        return;
      }

      const token = await registerForPushNotificationsAsync();
      if (isCancelled || !token) return;

      // Avoid noisy upserts on rerenders.
      if (
        lastRegisteredUserIdRef.current === userId &&
        lastRegisteredTokenRef.current === token
      ) {
        return;
      }

      lastRegisteredUserIdRef.current = userId;
      lastRegisteredTokenRef.current = token;
      setCurrentPushToken(token);

      await upsertDevicePushToken({
        expoPushToken: token,
        platform: Platform.OS === "ios" ? "ios" : "android",
        deviceId: null,
      });
    };

    register();

    return () => {
      isCancelled = true;
    };
  }, [setCurrentPushToken, userId]);

  // AppState listener for token auto-refresh
  // This tells Supabase Auth to continuously refresh the session automatically if
  // the app is in the foreground. When this is added, you will continue to receive
  // `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
  // if the user's session is terminated. This should only be registered once.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  // Deep link listener for auth callbacks (email verification, password reset, OAuth)
  useEffect(() => {
    const subscription = Linking.addEventListener('url', async ({ url }) => {
      // Expo Router will automatically handle the routing to /auth/callback
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Prevent rendering until the font has loaded or an error was returned
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProviderWrapper>
        <QueryProvider>
          <ToastProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(client)" />
              <Stack.Screen name="(professional)" />
            </Stack>
          </ToastProvider>
        </QueryProvider>
      </StripeProviderWrapper>
    </GestureHandlerRootView>
  );
}
