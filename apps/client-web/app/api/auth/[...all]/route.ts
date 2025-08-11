import { auth } from "../../../../lib/auth";
import { toNextJsHandler } from "@100handy/auth/better-auth-client";

// Using dummy auth implementation
export const { POST, GET } = toNextJsHandler(auth);
