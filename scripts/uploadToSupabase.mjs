import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Hata: SUPABASE_URL veya SERVICE_ROLE_KEY eksik. Ortam değişkenlerini yükleyin.");
  process.exit(1);
}

const [,, filePathArg, folderArg = "admin"] = process.argv;
if (!filePathArg) {
  console.error("Kullanım: node scripts/uploadToSupabase.mjs <DOSYA_YOLU> [klasor]");
  process.exit(1);
}

const inputPath = path.resolve(filePathArg);
if (!fs.existsSync(inputPath)) {
  console.error("Hata: Dosya bulunamadı:", inputPath);
  process.exit(1);
}

const fileBuffer = fs.readFileSync(inputPath);
const baseName = path.basename(inputPath).replace(/[^A-Za-z0-9_.-]/g, "_");
const key = `${folderArg}/${randomUUID()}-${baseName}`;

const ext = path.extname(baseName).toLowerCase();
const contentType = (
  ext === ".mp4" ? "video/mp4" :
  ext === ".mov" ? "video/quicktime" :
  ext === ".mkv" ? "video/x-matroska" :
  ext === ".webm" ? "video/webm" :
  "application/octet-stream"
);

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Bucket garanti
const bucket = "videos";
try {
  const { data: info } = await supabase.storage.getBucket(bucket);
  if (!info) {
    await supabase.storage.createBucket(bucket, { public: true });
  }
} catch {}

const { error: uploadErr } = await supabase.storage
  .from(bucket)
  .upload(key, fileBuffer, { contentType, upsert: false });

if (uploadErr) {
  console.error("Yükleme hatası:", uploadErr.message);
  process.exit(1);
}

const { data: pub } = await supabase.storage.from(bucket).getPublicUrl(key);
console.log(JSON.stringify({
  bucket,
  path: key,
  publicUrl: pub?.publicUrl || null,
  contentType,
  size: fileBuffer.length,
  fileName: baseName,
}, null, 2));


