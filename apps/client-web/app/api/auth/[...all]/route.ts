import { auth } from "../../../../lib/auth";
import { toNextJsHandler } from "@100handy/better-auth-client";

export const { POST, GET } = toNextJsHandler(auth);
