import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function EliteTaskersRedirectPage() {
  redirect("/100-handy-star");
}
