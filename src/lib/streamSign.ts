import crypto from "crypto";

const DEFAULT_SECRET = process.env.STREAM_SECRET || process.env.NEXT_PUBLIC_STREAM_SECRET || "dev-stream-secret";

export function hmacSign(payload: string, secret: string = DEFAULT_SECRET): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyHmac(payload: string, signature: string, secret: string = DEFAULT_SECRET): boolean {
  const expected = hmacSign(payload, secret);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "0.0.0.0";
}

export function b64encode(text: string): string {
  return Buffer.from(text, "utf-8").toString("base64url");
}

export function b64decode(b64: string): string {
  return Buffer.from(b64, "base64url").toString("utf-8");
}

export function buildSigPayload(params: { videoId: string; origin: string; expires: number; ip: string; ua: string; extra?: string }): string {
  const extra = params.extra || "";
  return `${params.videoId}|${params.origin}|${params.expires}|${params.ip}|${params.ua}|${extra}`;
}


