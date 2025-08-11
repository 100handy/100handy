import { createAuthClient } from "@100handy/auth/better-auth-client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: "http://192.168.1.66:3000",
  plugins: [
    // Removed expoClient plugin as we're using dummy implementation
  ],
});
