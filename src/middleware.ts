import type { NextRequest } from "next/server";

export function middleware(_req: NextRequest) {
  // Bazı tarayıcı indirme girişimlerini kısıtlamaya yardımcı olacak başlıklar
  // Netlify headers ile de set ediliyor; burada SSR yanıtları için de garanti altına alıyoruz.
  const headers = new Headers();
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), fullscreen=()");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Embedder-Policy", "require-corp");
  return new Response(null, { headers });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};


