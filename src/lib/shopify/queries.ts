export const PRODUCT_FRAGMENT = `#graphql
  fragment ProductFields on Product {
    id handle title description descriptionHtml productType vendor tags
    featuredImage { url altText width height }
    images(first: 12) { nodes { url altText width height } }
    media(first: 20) {
      nodes {
        id alt mediaContentType
        previewImage { url altText width height }
        ... on MediaImage { image { url altText width height } }
        ... on Video { sources { url mimeType format height width } }
        ... on ExternalVideo { embedUrl host }
      }
    }
    variants(first: 50) { nodes { id title sku availableForSale selectedOptions { name value } price { amount currencyCode } compareAtPrice { amount currencyCode } } }
    collections(first: 10) { nodes { handle title } }
    metafields(identifiers: [
      {namespace: "custom", key: "specifications"}, {namespace: "custom", key: "dimensions"},
      {namespace: "custom", key: "materials"}, {namespace: "custom", key: "warranty"},
      {namespace: "custom", key: "technical_document"}, {namespace: "custom", key: "brochure"},
      {namespace: "custom", key: "video_url"}, {namespace: "custom", key: "youtube_url"},
      {namespace: "custom", key: "featured"}, {namespace: "custom", key: "short_description"},
      {namespace: "custom", key: "application"}, {namespace: "custom", key: "certification"}
    ]) { namespace key value type }
    seo { title description }
  }
`;

export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCardFields on Product {
    id handle title productType vendor tags
    featuredImage { url altText width height }
    variants(first: 1) {
      nodes {
        id title sku availableForSale
        selectedOptions { name value }
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
      }
    }
    collections(first: 10) { nodes { handle title } }
    seo { title description }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `#graphql
  ${PRODUCT_FRAGMENT}
  query ProductByHandle($handle: String!) { product(handle: $handle) { ...ProductFields } }
`;

export const PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Products($first: Int!, $query: String) { products(first: $first, query: $query, sortKey: BEST_SELLING) { nodes { ...ProductCardFields } } }
`;

export const PRODUCTS_PAGE_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query ProductsPage(
    $first: Int
    $last: Int
    $after: String
    $before: String
    $query: String
    $sortKey: ProductSortKeys!
    $reverse: Boolean!
  ) {
    products(
      first: $first
      last: $last
      after: $after
      before: $before
      query: $query
      sortKey: $sortKey
      reverse: $reverse
    ) {
      nodes { ...ProductCardFields }
      pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
    }
    productTypes(first: 100) { nodes }
  }
`;

export const COLLECTION_QUERY = `#graphql
  ${PRODUCT_FRAGMENT}
  query Collection($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      id handle title description seo { title description }
      products(first: $first, after: $after) { nodes { ...ProductFields } pageInfo { hasNextPage endCursor } }
    }
  }
`;

export const COLLECTIONS_QUERY = `#graphql
  query Collections($first: Int!) {
    collections(first: $first, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id handle title description
        image { url altText width height }
        seo { title description }
      }
    }
  }
`;

export const BLOG_ARTICLES_QUERY = `#graphql
  query BlogArticles($blogsFirst: Int!, $articlesFirst: Int!) {
    blogs(first: $blogsFirst) {
      nodes {
        id handle title
        articles(first: $articlesFirst, sortKey: PUBLISHED_AT, reverse: true) {
          nodes {
            id handle title excerpt contentHtml publishedAt tags
            image { url altText width height }
            authorV2 { name }
            seo { title description }
          }
        }
      }
    }
  }
`;

export const ARTICLE_QUERY = `#graphql
  query Article($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      handle title
      articleByHandle(handle: $articleHandle) {
        id handle title excerpt contentHtml publishedAt tags
        image { url altText width height }
        authorV2 { name }
        seo { title description }
      }
    }
  }
`;

export const HOMEPAGE_HERO_QUERY = `#graphql
  query HomepageHero {
    metaobjects(type: "homepage_hero", first: 10, sortKey: "updated_at", reverse: true) {
      nodes {
        id handle
        fields {
          key value type
          reference {
            ... on MediaImage {
              image { url altText width height }
            }
          }
        }
      }
    }
  }
`;
