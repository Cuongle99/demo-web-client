import { hasShopifyConfig, shopifyFetch } from "./client";
import { ARTICLE_QUERY, BLOG_ARTICLES_QUERY } from "./queries";
import { normalizeArticle, type ShopifyArticleRaw } from "./normalize";
import type { BlogArticle } from "./types";

interface BlogsPayload {
  blogs: {
    nodes: Array<{
      handle: string;
      title: string;
      articles: { nodes: ShopifyArticleRaw[] };
    }>;
  };
}

interface ArticlePayload {
  blog: {
    handle: string;
    title: string;
    articleByHandle: ShopifyArticleRaw | null;
  } | null;
}

export async function getBlogArticles(first = 4): Promise<BlogArticle[]> {
  if (!hasShopifyConfig()) return [];
  try {
    const data = await shopifyFetch<BlogsPayload>(BLOG_ARTICLES_QUERY, { blogsFirst: 10, articlesFirst: first });
    return data.blogs.nodes
      .flatMap((blog) => blog.articles.nodes.map((article) => normalizeArticle(article, blog)))
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .slice(0, first);
  } catch {
    return [];
  }
}

export async function getArticle(blogHandle: string, articleHandle: string): Promise<BlogArticle | null> {
  if (!hasShopifyConfig()) return null;
  try {
    const data = await shopifyFetch<ArticlePayload>(ARTICLE_QUERY, { blogHandle, articleHandle });
    if (!data.blog?.articleByHandle) return null;
    return normalizeArticle(data.blog.articleByHandle, data.blog);
  } catch {
    return null;
  }
}
