import assert from "node:assert/strict";
import test from "node:test";

import { validateFrontmatter, validateUniqueSlugs } from "../src/lib/content-validation.ts";
import type { ContentDoc } from "../src/types/content.ts";

function buildValidFrontmatter() {
  return {
    title: "Valid Guide",
    slug: "valid-guide",
    description: "desc",
    date: "2026-01-01",
    lastUpdated: "2026-01-02",
    category: ["home-gym-small-spaces"],
    tags: ["fitness"],
    intent: "money-page",
    products: [
      {
        name: "Product",
        merchant: "amazon",
        url: "https://www.amazon.com/dp/B001ARYU58",
        priceRange: "$$",
        rating: 4.5,
        bestFor: "Overall",
        pros: ["pro"],
        cons: ["con"],
        image: "/images/product-placeholder.svg",
      },
    ],
  };
}

test("validateFrontmatter rejects invalid merchant", () => {
  const frontmatter = buildValidFrontmatter();
  frontmatter.products[0].merchant = "invalid-merchant";

  assert.throws(() => {
    validateFrontmatter(frontmatter, "tests/invalid-merchant");
  }, /merchant must be one of/);
});

test("validateFrontmatter rejects hard-coded tracking params", () => {
  const frontmatter = buildValidFrontmatter();
  frontmatter.products[0].url = "https://www.amazon.com/dp/B001ARYU58?tag=badtag-20";

  assert.throws(() => {
    validateFrontmatter(frontmatter, "tests/tracking-param");
  }, /must not contain tag\/ascsubtag/);
});

test("validateUniqueSlugs rejects duplicates", () => {
  const doc = {
    type: "guides",
    body: "",
    frontmatter: buildValidFrontmatter(),
  } as ContentDoc;

  const duplicate = {
    ...doc,
    type: "reviews",
  } as ContentDoc;

  assert.throws(() => {
    validateUniqueSlugs([doc, duplicate]);
  }, /Duplicate slug detected/);
});
