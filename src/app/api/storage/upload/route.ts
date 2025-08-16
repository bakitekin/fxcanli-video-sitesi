import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // büyük dosyalar için daha uzun süre

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string) || "uploads";

    // Node runtime'da global File olmayabilir; özelliğe dayalı kontrol yap
    if (!file || typeof (file as any).arrayBuffer !== "function") {
      return NextResponse.json({ error: "Dosya bulunamadı veya geçersiz payload" }, { status: 400 });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Sunucu Supabase ortam değişkenleri eksik" }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const bucket = "videos";
    // REST ile bucket'ı public olacak şekilde garanti altına al (idempotent)
    try {
      const ensureRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket/${bucket}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public: true }),
      });
      if (!ensureRes.ok && ensureRes.status !== 404) {
        // ignore errors; bucket zaten olabilir
      }
    } catch {}

    const fileName = (file as any).name || "upload.bin";
    const origName = String(fileName).replace(/[^a-zA-Z0-9_.-]/g, "_");
    const key = `${folder}/${randomUUID()}-${origName}`;

    const streamOrBuffer = typeof (file as any).stream === "function"
      ? (file as any).stream()
      : Buffer.from(await (file as any).arrayBuffer());

    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${encodeURIComponent(`${bucket}/${key}`)}`;
    const upRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": (file as any).type || "application/octet-stream",
      },
      // Node/undici için stream body'de duplex zorunlu
      duplex: "half" as any,
      body: streamOrBuffer as any,
    });

    if (!upRes.ok) {
      const errText = await upRes.text().catch(() => "");
      return NextResponse.json({ error: errText || `Yükleme başarısız (${upRes.status})` }, { status: 500 });
    }
    const upJson = await upRes.json().catch(() => ({} as any));
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodeURIComponent(key)}`.replace(/%2F/g, "/");

    return NextResponse.json({
      bucket,
      path: key,
      publicUrl,
      contentType: (file as any).type || null,
      size: (file as any).size || null,
      fileName: origName,
      id: (upJson as any).Id || null,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


