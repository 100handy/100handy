import { createAuth } from "@100handy/auth/better-auth";

// Using dummy auth implementation
export const auth = createAuth(process.env.DATABASE_URL || "");
