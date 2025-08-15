import { NextRequest } from "next/server";
import { b64decode, buildSigPayload, verifyHmac, getClientIp } from "@/lib/streamSign";

// TS/Key/Init segment proxy — token ve sig doğrulanır, ardından içerik stream edilir

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const sig = req.nextUrl.searchParams.get("sig") || "";
  if (!token) return new Response("missing token", { status: 400 });

  try {
    const { id, abs, expires, ip } = JSON.parse(b64decode(token)) as {
      id: string; abs: string; expires: number; ip: string;
    };
    if (Date.now() > expires) return new Response("expired", { status: 401 });

    const ua = req.headers.get("user-agent") || "";
    const clientIp = getClientIp(req.headers);
    if (clientIp !== ip) return new Response("ip mismatch", { status: 401 });

    const payload = buildSigPayload({ videoId: id, origin: abs, expires, ip, ua });
    if (!verifyHmac(payload, sig)) return new Response("bad signature", { status: 401 });

    const upstream = await fetch(abs, { headers: { "user-agent": ua } });
    if (!upstream.ok) return new Response("upstream error", { status: 502 });

    // İçeriği doğrudan pipe et
    const headers = new Headers(upstream.headers);
    // güvenlik için bazı başlıkları temizle/ayarla
    headers.delete("content-security-policy");
    return new Response(upstream.body, { status: 200, headers });
  } catch {
    return new Response("bad token", { status: 400 });
  }
}


