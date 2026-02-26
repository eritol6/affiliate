import assert from "node:assert/strict";
import test from "node:test";

process.env.NEXT_PUBLIC_AMAZON_TAG = "unit-test-20";

const { formatAffiliateUrl } = await import("../src/lib/affiliateConfig.ts");

test("formatAffiliateUrl appends amazon tag and subtag", () => {
  const url = formatAffiliateUrl("amazon", "https://www.amazon.com/dp/B001ARYU58", "guide-slot-1");
  const parsed = new URL(url);

  assert.equal(parsed.searchParams.get("tag"), "unit-test-20");
  assert.equal(parsed.searchParams.get("ascsubtag"), "guide-slot-1");
});

test("merchant other returns plain outbound link", () => {
  const url = formatAffiliateUrl("other", "https://www.roguefitness.com/dumbbells", "ignored-subtag");
  assert.equal(url, "https://www.roguefitness.com/dumbbells");
});
