import "@/globals.css";
import { Tabs } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { SplashScreen } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "@shared/supabase/supabaseClient";
import { Home, Briefcase, Heart, User } from "lucide-react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Futura-Medium": require("../assets/fonts/futura-medium.ttf"),
    "SourceCodeProVariable": require("../assets/fonts/SourceCodePro-Regular.ttf"),
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
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
            title: "Tasks",
          }}
        />
        <Tabs.Screen
          name="handy"
          options={{
            tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
            title: "Handy",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
            title: "Profile",
          }}
        />
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="sign-in" options={{ href: null }} />
        <Tabs.Screen name="sign-up" options={{ href: null }} />
        <Tabs.Screen name="verify-otp" options={{ href: null }} />
         <Tabs.Screen name="task-details" options={{ href: null }} />
      </Tabs>
    </GluestackUIProvider>
  );
}
