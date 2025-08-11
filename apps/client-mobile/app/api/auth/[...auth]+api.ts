import { createAuth } from "@100handy/auth/better-auth";

const handler = createAuth(process.env.DATABASE_URL || "").handler;
export { handler as GET, handler as POST };
