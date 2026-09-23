import type { Metafield } from "./types";

function lines(value?: string) {
  return value?.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) ?? [];
}

export function metafieldValue(fields: Metafield[], key: string) {
  return fields.find((field) => field.namespace === "custom" && field.key === key)?.value;
}

export function parseReferences(value?: string) {
  return lines(value).flatMap((line) => {
    const [label, rawUrl] = line.split("|", 2).map((part) => part.trim());
    try {
      const url = new URL(rawUrl);
      return url.protocol === "https:" ? [{ label: label || url.hostname, url: url.href }] : [];
    } catch { return []; }
  });
}

export function parseRelatedLinks(value?: string) {
  return lines(value).flatMap((line) => {
    const [label, href] = line.split("|", 2).map((part) => part.trim());
    return label && href?.startsWith("/") && !href.startsWith("//") ? [{ label, href }] : [];
  });
}

export function parseTechnicalSpecs(value?: string) {
  return lines(value).flatMap((line) => {
    const [label, specValue] = line.split("|", 2).map((part) => part.trim());
    return label && specValue ? [{ label, value: specValue }] : [];
  });
}
