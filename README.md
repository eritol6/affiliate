# Affiliate Content Site MVP (Picks Ledger)

A conversion-focused affiliate content site built with Next.js App Router + TypeScript + Tailwind.

Launch focus: **Home Gym for Small Spaces**
Architecture: **category-agnostic** (Home, Tech, Tools, Outdoor, etc.) and merchant-agnostic (Amazon + others).

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- MDX in repo (`content/*`) via `gray-matter` + `next-mdx-remote`
- No database (MVP)

## URL structure

- `/guides/{slug}`
- `/reviews/{slug}`
- `/compare/{slug}`
- `/category/{slug}`

Extra pages:

- `/about`
- `/privacy`
- `/affiliate-disclosure`
- `/methodology`
- `/deals`
- `/internal/checklist?key=...`

## Environment

Copy `.env.example` to `.env.local`.

Required:

- `NEXT_PUBLIC_AMAZON_TAG`

Optional:

- `NEXT_PUBLIC_SITE_URL`
- `CHECKLIST_KEY`
- `MERCHANT_WALMART_SUBTAG`
- `MERCHANT_TARGET_SUBTAG`
- `MERCHANT_OTHER_SUBTAG`

Env is validated at runtime/build startup (`src/lib/env.ts`) and fails fast when required values are invalid.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## CI-ready checks

```bash
npm run lint
npm run typecheck
npm run test
npm run validate:content
npm run build
```

All-in-one:

```bash
npm run check
```

## Content model (frontmatter)

All content files are MDX in:

- `content/guides/*.mdx`
- `content/reviews/*.mdx`
- `content/compare/*.mdx`
- `content/category/*.mdx`

Required frontmatter fields:

- `title`, `slug`, `description`, `date`, `lastUpdated`
- `category` (array)
- `tags` (array)
- `intent` (`money-page` | `comparison` | `review`)
- `products`: array of
  - `name`, `merchant`, `url`, `priceRange`, `rating`, `bestFor`, `pros[]`, `cons[]`, `image`, `specs[]?`

Optional:

- `featured`, `popularScore`, `sources[]`, `ogImage`

## Content integrity guardrails

At load/build time, the site validates:

- required frontmatter fields and types
- merchant enum correctness
- URL validity (`http/https`)
- no hard-coded `tag=`/`ascsubtag=` in content URLs
- no placeholder URL patterns (`example.com`, etc.)
- image file existence for local image paths
- unique slugs across all content types

Validation implementation:

- `src/lib/content-validation.ts`
- `src/lib/content.ts` (cached index + validation)
- `scripts/validate-content.ts`

## How to add content

### New guide

1. Create `content/guides/your-slug.mdx`.
2. Set frontmatter `slug` exactly equal to filename slug.
3. Add required product entries.
4. Write body sections (criteria, tradeoffs, FAQs).

### New review

1. Create `content/reviews/your-slug.mdx`.
2. Include primary product first in `products`.
3. Add alternatives in additional products.

### New category hub

1. Create `content/category/your-category-slug.mdx`.
2. Use same category slug in guide/review/compare files.

## Affiliate link system

Core files:

- `src/lib/affiliateConfig.ts`
- `src/components/OutboundLink.tsx`
- `src/components/BuyButton.tsx`
- `src/components/MerchantBadge.tsx`

Current merchant support:

- `amazon`
- `walmart`
- `target`
- `other`

All affiliate CTA links are rendered by `OutboundLink` and include:

- `target="_blank"`
- `rel="nofollow sponsored noopener noreferrer"`

### Amazon formatting

`formatAffiliateUrl()` appends `tag` from `NEXT_PUBLIC_AMAZON_TAG` and optional `ascsubtag`.

### Add a new merchant

1. Extend `Merchant` type in `src/types/content.ts`.
2. Add a merchant config entry in `src/lib/affiliateConfig.ts` (`displayName`, `defaultLabel`, `badge`, `buildUrl`).
3. Use the merchant in MDX product frontmatter.

## SEO + performance baseline

- Metadata + OG/Twitter defaults + canonical base in `src/app/layout.tsx`
- Per-route canonical metadata on index and dynamic pages
- Dynamic OG image fallback support (`ogImage` frontmatter override)
- JSON-LD:
  - Article schema (guides/reviews)
  - ItemList schema (guides)
- `sitemap.xml` and `robots.txt`
- `robots.txt` disallows `/internal`
- `next/image` used in product cards with fixed dimensions (no layout shift)

## Deployment (Vercel)

1. Push repository.
2. Import in Vercel.
3. Set env variables (at least `NEXT_PUBLIC_AMAZON_TAG`; set `NEXT_PUBLIC_SITE_URL` to production origin).
4. Deploy.

## Operational routes

- Health endpoint: `/api/health`
- Search index endpoint: `/api/search-index`
