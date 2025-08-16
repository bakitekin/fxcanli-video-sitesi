import { NextRequest } from "next/server";

// Basit OTP/Playback Info proxy — VdoCipher API Secret sadece server tarafında kullanılır
export async function GET(req: NextRequest) {
  const parts = req.nextUrl.pathname.split("/");
  const videoId = parts[parts.length - 1];
  const apiSecret = process.env.VDOCIPHER_API_SECRET;
  if (!apiSecret) return new Response(JSON.stringify({ error: "VDOCIPHER_API_SECRET missing" }), { status: 500 });

  try {
    // VdoCipher OTP endpoint (örnek): https://dev.vdocipher.com/api/videos/{videoId}/otp
    // Belgendeki doğru endpointi kullanın; burada placeholder.
    const otpRes = await fetch(`https://dev.vdocipher.com/api/videos/${encodeURIComponent(videoId)}/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Apisecret ${apiSecret}`,
      },
      body: JSON.stringify({ ttl: 900 }),
    });
    if (!otpRes.ok) {
      const t = await otpRes.text().catch(() => "");
      return new Response(JSON.stringify({ error: t || `vdocipher: ${otpRes.status}` }), { status: 502 });
    }
    const data = await otpRes.json();

    // Örnek dönüş -> Frontend DrmVideoPlayer için minimal map
    // Gerçek responsa göre map edilmeli
    const manifestUrl = data?.playbackInfo?.manifestUrl || data?.manifestUrl || "";
    const licenseServers: Record<string,string> = data?.licenseServers || {};
    const fairplayCertUrl: string | undefined = data?.fairplayCertUrl;

    return new Response(JSON.stringify({ drm: { manifestUrl, licenseServers, fairplayCertUrl } }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "otp fetch failed" }), { status: 500 });
  }
}


