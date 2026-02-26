# CONTRIBUTING GUIDE

## 1. Development Workflow

- Always create a branch before making changes.
- Run all quality gates before committing:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test` (if present)
  - `npm run build`
- Never commit or merge with failing checks.
- Keep commits small and logically scoped.
- Review diffs before merging.

Example commands:

```bash
git checkout -b feature/<name>
git add .
git commit -m "..."
git push
```

---

## 2. Core Architectural Rules (DO NOT BREAK)

- Route structure must remain:
  - `/guides/{slug}`
  - `/reviews/{slug}`
  - `/compare/{slug}`
  - `/category/{slug}`
- All content must come from MDX files in `/content`.
- Slugs must be unique across all content types.
- Do not hard-code product URLs in UI components.
- All outbound affiliate links must go through `OutboundLink` or `BuyButton`.
- Direct links like `<a href="https://amazon.com/...">` are prohibited.

`src/lib/affiliateConfig.ts` is the single source of truth for:
- `tag`
- `ascsubtag`
- merchant-specific URL formatting

---

## 3. Affiliate Compliance Rules

- Every affiliate outbound link must include:
  - `rel="nofollow sponsored"` (additional rel values are allowed)
  - `target="_blank"`
- Do not make static price claims unless backed by a dynamic data source.
- Affiliate disclosure must remain accessible site-wide.
- Amazon affiliate tag must come from environment variables, never hard-coded.

---

## 4. Content Schema Rules

Required MDX frontmatter:
- `title`
- `slug`
- `description`
- `intent`
- `category`
- `date`
- `products` (required for money pages)

Required product fields:
- `name`
- `merchant`
- `url`
- `pros[]`
- `cons[]`
- `priceRange` (optional)
- `rating` (optional)

Schema validation runs at build time and must not be bypassed.

---

## 5. SEO Protection Rules

- Do not remove metadata generation.
- Do not remove JSON-LD schema.
- Do not alter canonical URL logic.
- Sitemap must include all supported content types.
- Do not introduce duplicate routes.

---

## 6. Performance Rules

- Prefer Server Components by default.
- Use Client Components only when required.
- Do not add heavy dependencies without clear justification.
- Preserve `next/image` usage for content imagery.

---

## 7. Adding a New Content Type

1. Add a new MDX folder under `/content`.
2. Define and enforce frontmatter schema validation.
3. Add the route and page template.
4. Update sitemap generation.
5. Add route metadata and canonical handling.
6. Run full build and validation checks.

---

## 8. Before Merging Any Change

- Does `npm run build` pass?
- Does lint pass?
- Do affiliate links still include tag + subtag formatting rules?
- Are schema validations still enforced?
- Are placeholder ASINs or placeholder URLs absent?
- Did bundle size increase significantly?

---

## 9. AI Agent Usage Rules

- Require the agent to explain current implementation before editing.
- Require minimal diffs.
- Never request full rewrites for localized changes.
- Always request a diff summary.
- Always create a git snapshot before structural changes.
