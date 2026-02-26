export type Merchant = "amazon" | "walmart" | "target" | "other";

export type Product = {
  name: string;
  merchant: Merchant;
  url: string;
  priceRange: string;
  rating: number;
  bestFor: string;
  pros: string[];
  cons: string[];
  image: string;
  specs?: string[];
};

export type ContentIntent = "money-page" | "comparison" | "review";

export type BaseFrontmatter = {
  title: string;
  slug: string;
  description: string;
  date: string;
  lastUpdated: string;
  category: string[];
  tags: string[];
  intent: ContentIntent;
  products: Product[];
  featured?: boolean;
  popularScore?: number;
  sources?: string[];
  ogImage?: string;
};

export type ContentType = "guides" | "reviews" | "compare" | "category";

export type ContentDoc = {
  type: ContentType;
  frontmatter: BaseFrontmatter;
  body: string;
};

export type SearchEntry = {
  type: ContentType;
  title: string;
  slug: string;
  description: string;
  category: string[];
  tags: string[];
  date: string;
  url: string;
};
