import type { Product } from "./types";

const commonWords = new Set([
  "sản", "phẩm", "thiết", "bị", "hỗ", "trợ", "chức", "năng", "loại", "cho",
  "của", "và", "các", "người", "dùng", "với", "tại", "nhà", "theo", "tập",
]);

function titleWords(title: string) {
  const normalized = title.toLocaleLowerCase("vi-VN").replace(/phục\s+hồi/g, "phụchồi");
  return new Set((normalized.match(/[\p{L}\p{N}]+/gu) ?? [])
    .filter((word) => word.length > 2 && !commonWords.has(word)));
}

export function relatedProducts(product: Product, candidates: Product[], limit = 10) {
  const words = titleWords(product.title);
  const collections = new Set(product.collections.map((collection) => collection.handle));

  return candidates
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => {
      const sharedWords = [...titleWords(candidate.title)].filter((word) => words.has(word)).length;
      const sharedCollections = candidate.collections.filter((collection) => collections.has(collection.handle)).length;
      return { candidate, sharedWords, score: sharedWords * 2 + Math.min(sharedCollections, 2) };
    })
    .filter(({ sharedWords }) => sharedWords >= 2)
    .sort((a, b) => b.score - a.score || a.candidate.title.localeCompare(b.candidate.title, "vi"))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
