import { NextRequest } from "next/server";
import { b64decode, buildSigPayload, verifyHmac, getClientIp } from "@/lib/streamSign";

// HLS AES-128 anahtar proxy — token ve sig doğrulanır, anahtar bytes döndürülür

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
    const buf = await upstream.arrayBuffer();
    return new Response(buf, { status: 200, headers: { "content-type": "application/octet-stream" } });
  } catch {
    return new Response("bad token", { status: 400 });
  }
}


