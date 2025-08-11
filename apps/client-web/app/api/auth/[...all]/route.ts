import { auth } from "../../../../lib/auth";
import { toNextJsHandler } from "@100handy/auth/better-auth-client";

export const { POST, GET } = toNextJsHandler(auth);
