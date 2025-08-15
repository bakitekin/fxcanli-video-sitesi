import { NextRequest } from "next/server";
import { api } from "@/lib/api";
import { b64encode, buildSigPayload, getClientIp, hmacSign } from "@/lib/streamSign";

// Bu endpoint, backend'den gelen gerçek DRM/HLS playlist URL'ini alır ve
// istemciye imzalı, süreli ve IP/UA bağlı bir proxy URL döner.

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  // /api/videos/stream/:id
  const parts = url.pathname.split("/");
  const id = parts[parts.length - 1] || "";

  try {
    // Backend'den video için DRM/HLS kaynak URL'i al
    const stream = await api.getStream(id);
    // Eğer backend DRM bilgisi dönüyorsa doğrudan bunu ilet
    if (stream?.drm?.manifestUrl && stream?.drm?.licenseServers) {
      return new Response(
        JSON.stringify({
          drm: {
            manifestUrl: stream.drm.manifestUrl,
            licenseServers: stream.drm.licenseServers,
            fairplayCertUrl: stream.drm.fairplayCertUrl,
          },
        }),
        { headers: { "content-type": "application/json" } }
      );
    }

    // Aksi halde HLS proxy akışını üret
    const originUrl = stream.hls_url || stream.drm_url; // gerçek m3u8
    if (!originUrl) throw new Error("no origin");

    const now = Date.now();
    const expires = now + 15 * 60 * 1000; // 15 dk
    const ip = getClientIp(req.headers);
    const ua = req.headers.get("user-agent") || "";
    const payload = buildSigPayload({ videoId: id, origin: originUrl, expires, ip, ua });
    const sig = hmacSign(payload);

    const token = b64encode(JSON.stringify({ id, originUrl, expires, ip }));
    const proxyUrl = `${req.nextUrl.origin}/api/videos/proxy/manifest?token=${encodeURIComponent(token)}&sig=${sig}`;

    return new Response(JSON.stringify({ m3u8: proxyUrl }), { headers: { "content-type": "application/json" } });
  } catch (_e) {
    return new Response(JSON.stringify({ error: "stream error" }), { status: 500 });
  }
}


