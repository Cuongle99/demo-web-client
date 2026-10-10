import "server-only";
import type { ContactRequest, QuoteRequest } from "@/lib/shopify/types";

export async function deliverInquiry(kind: "contact" | "quote", payload: ContactRequest | QuoteRequest) {
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) return { delivered: process.env.NODE_ENV !== "production", provider: "development-sink" };
  const url = new URL(webhook);
  if (url.username || url.password || (url.protocol !== "https:" &&
    !(process.env.NODE_ENV === "development" && url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)))) {
    throw new Error("Contact provider requires a secure URL.");
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.CONTACT_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` } : {}),
    },
    body: JSON.stringify({ kind, payload }),
    // Do not forward customer data to redirects or hang indefinitely.
    redirect: "error",
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Contact provider rejected the request (${response.status}).`);
  return { delivered: true, provider: "webhook" };
}
