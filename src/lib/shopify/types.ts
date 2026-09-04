export interface CatalogImage {
  url: string;
  altText: string;
  width?: number;
  height?: number;
  focalPosition?: string;
}

export interface VideoSource {
  url: string;
  mimeType: string;
  format: string;
  width?: number;
  height?: number;
}

export type ProductMedia =
  | { id: string; type: "image"; altText: string; image: CatalogImage }
  | { id: string; type: "video"; altText: string; previewImage?: CatalogImage; sources: VideoSource[] }
  | { id: string; type: "externalVideo"; altText: string; previewImage?: CatalogImage; embedUrl: string; host?: string };

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku?: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice?: Money;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface Metafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  featuredImage?: CatalogImage;
  images: CatalogImage[];
  media: ProductMedia[];
  variants: ProductVariant[];
  productType?: string;
  vendor?: string;
  tags: string[];
  collections: Array<{ handle: string; title: string }>;
  metafields: Metafield[];
  seo: { title?: string; description?: string };
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  seo: { title?: string; description?: string };
  products: Product[];
  pageInfo?: { hasNextPage: boolean; endCursor?: string };
}

export interface CollectionSummary {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: CatalogImage;
  seo: { title?: string; description?: string };
}

export interface BlogArticle {
  id: string;
  handle: string;
  blogHandle: string;
  blogTitle: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  image?: CatalogImage;
  author?: string;
  tags: string[];
  seo: { title?: string; description?: string };
}

export interface QuoteRequest {
  name: string;
  company?: string;
  email: string;
  phone: string;
  productId?: string;
  productHandle?: string;
  productTitle: string;
  productSku?: string;
  message: string;
}

export interface ContactRequest {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}
