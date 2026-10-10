import "server-only";
import sanitizeHtml from "sanitize-html";

/** Sanitize CMS rich text at the HTML rendering boundary, including preview data. */
export function safeRichText(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
      "*": ["style"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https"] },
    allowProtocolRelative: false,
    allowedStyles: {
      "*": {
        "text-align": [/^(left|right|center|justify)$/],
        "font-weight": [/^(normal|bold|[1-9]00)$/],
        "font-style": [/^(normal|italic)$/],
        "text-decoration": [/^(none|underline|line-through)$/],
        "width": [/^\d+(?:\.\d+)?(?:px|%)$/],
        "max-width": [/^\d+(?:\.\d+)?(?:px|%)$/],
        "height": [/^(?:auto|\d+(?:\.\d+)?px)$/],
      },
    },
    transformTags: {
      a: (tagName, attribs) => ({ tagName, attribs: {
        ...attribs,
        ...(attribs.target === "_blank" ? { rel: "noopener noreferrer" } : {}),
      } }),
    },
  });
}
