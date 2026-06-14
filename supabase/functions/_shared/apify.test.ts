import { assertEquals } from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { buildDedupKey, mapItem, signPayload, verifySignature } from "./apify.ts";

Deno.test("mapItem applies field mapping", () => {
  const mapping = { raw_text: "body", profile_name: "author", source_url: "url", external_id: "id" };
  const out = mapItem({ body: "need a cleaner", author: "sarah", url: "http://x/1", id: "1" }, mapping);
  assertEquals(out.raw_text, "need a cleaner");
  assertEquals(out.profile_name, "sarah");
  assertEquals(out.source_url, "http://x/1");
  assertEquals(out.external_id, "1");
  assertEquals(out.business_name, null);
});

Deno.test("mapItem reads dotted paths", () => {
  const out = mapItem({ author: { name: "Jane" } }, { profile_name: "author.name" });
  assertEquals(out.profile_name, "Jane");
});

Deno.test("buildDedupKey prefers external_id, lowercased + scoped", () => {
  assertEquals(buildDedupKey("src1", { external_id: "ABC", source_url: null, raw_text: "Hi" }), "src1:abc");
});

Deno.test("buildDedupKey falls back to source_url then raw_text", () => {
  assertEquals(
    buildDedupKey("src1", { external_id: null, source_url: "http://X/2", raw_text: "Hi" }),
    "src1:http://x/2",
  );
  assertEquals(buildDedupKey("src1", { external_id: null, source_url: null, raw_text: "Hello World" }), "src1:hello world");
});

Deno.test("verifySignature accepts a valid signature and rejects a bad one", async () => {
  const sig = await signPayload("run-123", "secret");
  assertEquals(await verifySignature("run-123", sig, "secret"), true);
  assertEquals(await verifySignature("run-123", "bad", "secret"), false);
  assertEquals(await verifySignature("run-123", sig, "wrong-secret"), false);
});
