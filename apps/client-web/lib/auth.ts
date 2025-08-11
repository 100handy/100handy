import { createAuth } from "@100handy/auth/better-auth";

export const auth = createAuth(process.env.DATABASE_URL || "");
