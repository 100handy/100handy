import { assertEquals } from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { computeNextRunAt, fallbackClassify } from "./outreach-classify.ts";

Deno.test("computeNextRunAt off returns null", () => {
  assertEquals(computeNextRunAt("off", new Date("2026-06-14T00:00:00Z")), null);
});

Deno.test("computeNextRunAt every_6h adds 6 hours", () => {
  const next = computeNextRunAt("every_6h", new Date("2026-06-14T00:00:00Z"));
  assertEquals(next, "2026-06-14T06:00:00.000Z");
});

Deno.test("computeNextRunAt daily adds 24 hours", () => {
  const next = computeNextRunAt("daily", new Date("2026-06-14T09:30:00Z"));
  assertEquals(next, "2026-06-15T09:30:00.000Z");
});

Deno.test("computeNextRunAt unknown cadence returns null", () => {
  assertEquals(computeNextRunAt("nonsense", new Date("2026-06-14T00:00:00Z")), null);
});

Deno.test("fallbackClassify worker builds worker draft", () => {
  const lead = fallbackClassify(
    { raw_text: "Handyman in Warrington", profile_name: "John" },
    "worker_finder",
    "Handyman",
  );
  assertEquals(lead.lead_type, "worker");
  assertEquals(lead.draft_text.includes("John"), true);
  assertEquals(lead.draft_text.includes("trusted professionals"), true);
});

Deno.test("fallbackClassify customer builds customer draft", () => {
  const lead = fallbackClassify(
    { raw_text: "Need a cleaner in Liverpool", profile_name: "Sarah" },
    "customer_finder",
    "Cleaning",
  );
  assertEquals(lead.lead_type, "customer");
  assertEquals(lead.draft_text.includes("vetted local professional"), true);
});
