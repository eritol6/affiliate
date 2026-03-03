export type Merchant = "amazon" | "walmart" | "target" | "other";

export type Product = {
  name: string;
  merchant: Merchant;
  url: string;
  priceRange: string;
  weightRange?: string;
  incrementSize?: string;
  adjustmentSpeed?: string;
  score?: number;
  rating?: number;
  bestFor: string;
  footprint?: string;
  ceilingHeight?: string;
  resistanceType?: string;
  maxResistance?: string;
  pros: string[];
  cons: string[];
  image: string;
  specs?: string[];
};

export type ContentKind = "guide" | "comparison" | "review";
export type LegacyContentIntent = "money-page" | "comparison" | "review";
export type RouteContentType = "guides" | "reviews" | "compare" | "category";

export type BaseFrontmatter = {
  title: string;
  description: string;
  date: string;
  category: string;
  affiliateDisclosure: boolean;
  products: string[];
  type: ContentKind;
  slug?: string;
  lastUpdated?: string;
  tags?: string[];
};

export type ParsedFrontmatter = BaseFrontmatter & {
  slug: string;
  lastUpdated?: string;
  tags: string[];
  category: string;
  productData: Product[];
  products: string[];
};

export type LegacyFrontmatter = {
  title: string;
  slug: string;
  description: string;
  date: string;
  lastUpdated: string;
  category: string[];
  tags?: string[];
  intent: LegacyContentIntent;
  products: Product[];
  type?: ContentKind;
  affiliateDisclosure?: boolean;
  featured?: boolean;
  popularScore?: number;
  sources?: string[];
  ogImage?: string;
};

export type ContentDoc = {
  type: ContentKind;
  frontmatter: ParsedFrontmatter &
    Pick<LegacyFrontmatter, "featured" | "popularScore" | "sources" | "ogImage">;
  body: string;
};

export type SearchEntry = {
  type: ContentKind;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  url: string;
};
