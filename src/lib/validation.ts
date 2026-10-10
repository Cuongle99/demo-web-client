import { siteConfig } from "@/config/site";

type UnknownRecord = Record<string, unknown>;
export const MAX_INQUIRY_BYTES = 32 * 1024;

export class RequestValidationError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function text(value: unknown, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as UnknownRecord : null;
}

export async function requestData(request: Request): Promise<UnknownRecord | null> {
  // Same-origin browser forms only. Origin checks are not bot protection.
  const origin = request.headers.get("origin");
  const requestUrl = new URL(request.url);
  const allowedOrigins = new Set([new URL(siteConfig.url).origin, requestUrl.origin]);
  // Next.js can normalize request.url to localhost internally. Match the actual
  // HTTP Host too; browsers cannot set Host independently of their destination.
  const host = request.headers.get("host");
  if (host) allowedOrigins.add(`${requestUrl.protocol}//${host}`);
  if (!origin || !allowedOrigins.has(origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new RequestValidationError(403, "Nguồn gửi yêu cầu không hợp lệ.");
  }
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    throw new RequestValidationError(415, "Định dạng dữ liệu không được hỗ trợ.");
  }
  const declaredLength = request.headers.get("content-length");
  if (declaredLength && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_INQUIRY_BYTES)) {
    throw new RequestValidationError(413, "Nội dung gửi quá lớn.");
  }
  if (!request.body) return null;

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    void reader.cancel().catch(() => {});
  }, 10_000);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (timedOut) throw new RequestValidationError(408, "Yêu cầu gửi quá chậm. Vui lòng thử lại.");
      if (done) break;
      size += value.byteLength;
      // Count actual bytes, including chunked bodies with missing/false lengths.
      if (size > MAX_INQUIRY_BYTES) {
        void reader.cancel().catch(() => {});
        throw new RequestValidationError(413, "Nội dung gửi quá lớn.");
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    try {
      return asRecord(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)));
    } catch {
      throw new RequestValidationError(400, "Dữ liệu không hợp lệ.");
    }
  } finally {
    clearTimeout(timer);
    reader.releaseLock();
  }
}

export function inquiryError(error: unknown, fallback: string) {
  return Response.json({ message: error instanceof RequestValidationError ? error.message : fallback }, {
    status: error instanceof RequestValidationError ? error.status : 500,
    headers: { "Cache-Control": "no-store" },
  });
}
