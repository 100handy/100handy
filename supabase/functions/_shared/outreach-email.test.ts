import { assertEquals } from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { buildFollowUpText, isValidEmail, nextFollowUpDueDays } from "./outreach-email.ts";

Deno.test("isValidEmail accepts a normal address and rejects junk", () => {
  assertEquals(isValidEmail("info@trade.co.uk"), true);
  assertEquals(isValidEmail("nope"), false);
  assertEquals(isValidEmail(null), false);
});

Deno.test("nextFollowUpDueDays advances step 1 then stops", () => {
  assertEquals(nextFollowUpDueDays(1), 7);
  assertEquals(nextFollowUpDueDays(2), null);
  assertEquals(nextFollowUpDueDays(3), null);
});

Deno.test("buildFollowUpText is personalised and step-aware", () => {
  const first = buildFollowUpText("Acme Plumbing", 1);
  assertEquals(first.includes("Acme Plumbing"), true);
  assertEquals(first.includes("following up"), true);

  const last = buildFollowUpText(null, 2);
  assertEquals(last.includes("there"), true);
  assertEquals(last.includes("one last time"), true);
});
