import "@/globals.css";
import { Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { SplashScreen } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "@shared/supabase/supabaseClient";
import { AuthWrapper } from "@/components/AuthWrapper";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned)
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const sub = Linking.addEventListener('url', async ({ url }) => {
      // supabase-js v2 in RN will parse the url if you call this:
      await supabase.auth.startAutoRefresh();
      // navigate as needed
    });
    return () => sub.remove();
  }, []);

  // Prevent rendering until the font has loaded or an error was returned
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <AuthWrapper>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </AuthWrapper>
    </GluestackUIProvider>
  );
}
