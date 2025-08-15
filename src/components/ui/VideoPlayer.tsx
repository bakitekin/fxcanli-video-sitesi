"use client";
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import { logSecurityEvent } from "@/lib/securityLogs";

interface VideoPlayerProps {
  src: string; // HLS playlist (m3u8) veya DRM proxy URL
  fullName: string;
  tcNo: string;
  speed?: number; // 0.1 - 2.0
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, fullName, tcNo, speed = 0.6 }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const requestFs = (el: HTMLElement) => {
    const anyEl = el as unknown as {
      webkitRequestFullscreen?: () => Promise<void> | void;
      msRequestFullscreen?: () => Promise<void> | void;
      requestFullscreen?: () => Promise<void> | void;
    };
    if (anyEl.requestFullscreen) return anyEl.requestFullscreen();
    if (anyEl.webkitRequestFullscreen) return anyEl.webkitRequestFullscreen();
    if (anyEl.msRequestFullscreen) return anyEl.msRequestFullscreen();
    return Promise.reject();
  };

  const exitFs = () => {
    const anyDoc = document as unknown as {
      webkitExitFullscreen?: () => Promise<void> | void;
      msExitFullscreen?: () => Promise<void> | void;
      exitFullscreen?: () => Promise<void> | void;
      webkitFullscreenElement?: Element | null;
    };
    if (anyDoc.exitFullscreen) return anyDoc.exitFullscreen();
    if (anyDoc.webkitExitFullscreen) return anyDoc.webkitExitFullscreen();
    if (anyDoc.msExitFullscreen) return anyDoc.msExitFullscreen();
    return Promise.resolve();
  };

  const toggleFullscreen = () => {
    const wrapper = wrapperRef.current;
    const anyDoc = document as unknown as { webkitFullscreenElement?: Element | null };
    if (!wrapper) return;
    const isFs = document.fullscreenElement === wrapper || anyDoc.webkitFullscreenElement === wrapper;
    if (isFs) {
      exitFs();
    } else {
      const p = requestFs(wrapper);
      // p void dönebilir; try/catch ile sessizleştir
      try { (p as Promise<void>).catch?.(() => {}); } catch {}
    }
  };
  // oynatma durumu, gerekirse UI için kullanılabilir (şimdilik kullanmıyoruz)

  // Geliştirici araçları ve kısayolları engelle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey; // macOS (meta) ve Windows/Linux (ctrl)
      const modShift = (e.ctrlKey || e.metaKey) && e.shiftKey;
      if (
        // F12
        key === "f12" ||
        // Geliştirici araçları: I/J/K/C
        (modShift && (key === "i" || key === "j" || key === "k" || key === "c")) ||
        // Kaynak görüntüleme / kaydetme / dosya arama: U/S/P/O
        (mod && (key === "u" || key === "s" || key === "p" || key === "o"))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onCtx = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("keydown", onKey);
    document.addEventListener("contextmenu", onCtx);
    // Basit devtools tespiti (boyut farkı)
    const threshold = 160;
    const interval = setInterval(() => {
      const suspicious =
        (window.outerWidth - window.innerWidth > threshold) ||
        (window.outerHeight - window.innerHeight > threshold);
      if (suspicious) {
        const v = videoRef.current;
        if (v && !v.paused) v.pause();
      }
    }, 600);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("contextmenu", onCtx);
      clearInterval(interval);
    };
  }, []);

  // Video + Canvas kurulum
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // PiP ve RemotePlayback engelleme
    try {
      (video as any).disablePictureInPicture = true;
      (video as any).disableRemotePlayback = true;
    } catch {}

    // İndirme engellemeleri
    const prevent = (e: Event) => e.preventDefault();
    video.addEventListener("contextmenu", prevent);
    video.addEventListener("dragstart", prevent);

    // HLS kaynak yükleme (yalnızca m3u8 için)
    let hls: Hls | null = null;
    const isM3U8 = src.endsWith(".m3u8") || src.includes("m3u8");
    if (isM3U8 && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      // Tarayıcı native HLS destekliyorsa direkt at
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else {
        // Fallback mp4 vs. durumunda yine de korumaları sürdür
        video.src = src;
      }
    }

    // Canvas boyutlarını video elementine göre eşle
    const syncCanvasSize = () => {
      const wrapper = wrapperRef.current || (video.parentElement as HTMLElement | null);
      const rect = (wrapper ? wrapper.getBoundingClientRect() : video.getBoundingClientRect());
      canvas.width = Math.max(1, Math.floor(rect.width));
      canvas.height = Math.max(1, Math.floor(rect.height));
    };
    syncCanvasSize();
    window.addEventListener("resize", syncCanvasSize);

    let raf = 0;
    let t = 0;

    const draw = () => {
      // Gerçek video görüntüsünü gizle; canvas'a çiz
      try {
        // Video elementini doğrudan canvas'a çizmek CORS ister; bu yüzden sadece watermark overlay çizeriz
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } catch {}

      // Hareketli ve değişken opasiteli watermark metni
      t += speed;
      const nameText = `${fullName}`;
      const tcText = `${tcNo}`;

      // Birincil dinamik pozisyon
      const x = ((Math.sin(t / 20) + 1) / 2) * (canvas.width - 320) + 20;
      const y = ((Math.cos(t / 18) + 1) / 2) * (canvas.height - 80) + 20;

      ctx.font = "600 18px Kodchasan, sans-serif";
      ctx.textBaseline = "top";
      ctx.lineWidth = 2;

      const opacity = 0.6 + 0.2 * Math.sin(t / 10);
      ctx.fillStyle = `rgba(0,0,0,${Math.max(0.35, opacity)})`;
      ctx.strokeStyle = `rgba(255,255,255,${Math.max(0.5, opacity)})`;

      ctx.strokeText(nameText, x, y);
      ctx.fillText(nameText, x, y);
      ctx.strokeText(tcText, x, y + 24);
      ctx.fillText(tcText, x, y + 24);

      // İkincil periyodik izler
      if (Math.floor(t) % 15 < 7) {
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillText(`${fullName} • ${tcNo}`, 24, canvas.height - 36);
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(draw);
    };

    const onPlay = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onPause = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      // duraklayınca son frame'i temizle
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    const onFsChange = () => {
      try {
        const fsEl = document.fullscreenElement as Element | null;
        const wrapper = wrapperRef.current;
        if (fsEl === video && wrapper && wrapper.requestFullscreen) {
          document.exitFullscreen().catch(() => {}).finally(() => {
            wrapper.requestFullscreen?.().catch(() => {});
          });
        }
      } catch {}
      syncCanvasSize();
      logSecurityEvent("fullscreen_toggle").catch(()=>{});
    };
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange as EventListener);

    // Ekran kaydı girişimini engelle (destekleyen tarayıcılarda)
    const md = (navigator as unknown as { mediaDevices?: { getDisplayMedia?: (...a: unknown[]) => Promise<MediaStream> } }).mediaDevices;
    if (md && md.getDisplayMedia) {
      const original = md.getDisplayMedia.bind(md);
      md.getDisplayMedia = () => {
        const v = videoRef.current;
        if (v && !v.paused) v.pause();
        return Promise.reject(new Error("Screen recording not allowed"));
      };
      // geri alma
      return () => {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener("resize", syncCanvasSize);
        video.removeEventListener("contextmenu", prevent);
        video.removeEventListener("dragstart", prevent);
        video.removeEventListener("play", onPlay);
        video.removeEventListener("pause", onPause);
        if (hls) hls.destroy();
        try {
          (navigator as unknown as { mediaDevices?: { getDisplayMedia?: (...a: unknown[]) => Promise<MediaStream> } }).mediaDevices!.getDisplayMedia = original;
        } catch {}
      };
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", syncCanvasSize);
      video.removeEventListener("contextmenu", prevent);
      video.removeEventListener("dragstart", prevent);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      if (hls) hls.destroy();
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange as EventListener);
    };
  }, [src, fullName, tcNo, speed]);

  return (
    <div ref={wrapperRef} className="relative w-full aspect-video rounded-xl overflow-hidden bg-black select-none">
      {/* Gerçek video görünür, ancak sağ tık / PiP / remote playback engelli ve controlsList kısıtlı */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        playsInline
        x-webkit-airplay="deny"
        crossOrigin="anonymous"
        controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
        onContextMenu={(e) => e.preventDefault()}
        preload="metadata"
        onDoubleClick={toggleFullscreen}
      />
      {/* Üstte dinamik watermark canvas'ı. pointer-events none, böylece kullanıcı etkileşimi video üzerinde kalır */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />
      {/* Özel fullscreen butonu */}
      <button
        type="button"
        onClick={toggleFullscreen}
        className="absolute top-2 right-2 z-20 rounded-md bg-black/50 text-white text-xs px-2 py-1 hover:bg-black/60"
        aria-label="Tam ekran"
      >
        Tam ekran
      </button>
    </div>
  );
};

export default VideoPlayer;
