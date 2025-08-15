import { NextRequest } from "next/server";
import { b64decode, buildSigPayload, verifyHmac, getClientIp, b64encode } from "@/lib/streamSign";

// m3u8 manifest proxy — token ve sig doğrulanır, segment ve key URL'leri de kendi proxy'mize yeniden yazılır

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const sig = req.nextUrl.searchParams.get("sig") || "";
  if (!token) return new Response("missing token", { status: 400 });

  try {
    const { id, originUrl, expires, ip } = JSON.parse(b64decode(token)) as {
      id: string; originUrl: string; expires: number; ip: string;
    };

    if (Date.now() > expires) return new Response("expired", { status: 401 });

    const ua = req.headers.get("user-agent") || "";
    const clientIp = getClientIp(req.headers);
    if (clientIp !== ip) return new Response("ip mismatch", { status: 401 });

    const payload = buildSigPayload({ videoId: id, origin: originUrl, expires, ip, ua });
    if (!verifyHmac(payload, sig)) return new Response("bad signature", { status: 401 });

    // origin manifesti al
    const res = await fetch(originUrl, { headers: { "user-agent": ua } });
    if (!res.ok) return new Response("upstream error", { status: 502 });
    const text = await res.text();

    // Segment ve key URL'lerini proxy'ye yeniden yaz
    const base = new URL(originUrl);
    const rewritten = text.split("\n").map(line => {
      if (!line) return line;
      // KEY satırlarını yakala ve URI'yi proxy key endpointine çevir
      if (line.startsWith("#EXT-X-KEY:")) {
        const attrs = line.replace("#EXT-X-KEY:", "");
        const parts = attrs.split(",").map(p => p.trim()).filter(Boolean);
        let uriValue: string | null = null;
        const others: string[] = [];
        for (const p of parts) {
          const [k, v] = p.split("=");
          if (k === "URI") {
            uriValue = v?.replace(/^"|"$/g, "") || null;
          } else {
            others.push(p);
          }
        }
        if (uriValue) {
          const absKey = new URL(uriValue, base).toString();
          const keyToken = encodeURIComponent(b64encode(JSON.stringify({ id, abs: absKey, expires, ip })));
          const newUri = `${req.nextUrl.origin}/api/videos/proxy/key?token=${keyToken}&sig=${sig}`;
          return `#EXT-X-KEY:URI="${newUri}"${others.length ? "," + others.join(",") : ""}`;
        }
        return line;
      }
      // Diğer yorum satırları aynı kalsın
      if (line.startsWith("#")) return line;
      // Segment URL'lerini proxy'e çevir
      const abs = new URL(line, base).toString();
      const innerToken = encodeURIComponent(b64encode(JSON.stringify({ id, abs, expires, ip })));
      return `${req.nextUrl.origin}/api/videos/proxy/segment?token=${innerToken}&sig=${sig}`;
    }).join("\n");

    return new Response(rewritten, { headers: { "content-type": "application/vnd.apple.mpegurl" } });
  } catch {
    return new Response("bad token", { status: 400 });
  }
}


