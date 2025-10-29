import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Loader } from "@/components/ui/loader";

/**
 * Index Route - Entry Point
 * 
 * Redirects unauthenticated users directly to role selection.
 * Authenticated users are handled by AuthWrapper which will
 * route them to the appropriate home screen based on their role.
 */
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to role selection
    // AuthWrapper will intercept this if user is already authenticated
    router.replace('/(auth)/role-selection');
  }, [router]);

  return <Loader />;
}
