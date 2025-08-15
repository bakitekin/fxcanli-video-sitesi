"use client";
import React, { useEffect, useRef } from "react";
import { logSecurityEvent } from "@/lib/securityLogs";

type LicenseServers = Partial<{
  "com.widevine.alpha": string;
  "com.microsoft.playready": string;
  "com.apple.fps.1_0": string; // FairPlay
}>;

interface DrmVideoPlayerProps {
  manifestUrl: string; // DASH (mpd) veya HLS (m3u8) — DRM sağlayıcınıza bağlı
  licenseServers: LicenseServers; // key system -> license URL eşlemesi
  fairplayCertUrl?: string; // opsiyonel FairPlay sertifika URL'i
  fullName: string;
  tcNo: string;
  speed?: number;
}

const DrmVideoPlayer: React.FC<DrmVideoPlayerProps> = ({
  manifestUrl,
  licenseServers,
  fairplayCertUrl,
  fullName,
  tcNo,
  speed = 0.6,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;
      const modShift = (e.ctrlKey || e.metaKey) && e.shiftKey;
      const modAlt = (e.metaKey && e.altKey) || (e.ctrlKey && e.altKey);
      if (
        key === "f12" ||
        (modShift && (key === "i" || key === "j" || key === "k" || key === "c")) ||
        (modAlt && (key === "i" || key === "j" || key === "k" || key === "c")) ||
        (mod && (key === "u" || key === "s" || key === "p" || key === "o"))
      ) {
        e.preventDefault();
        e.stopPropagation();
        logSecurityEvent("devtools_detected", { keyCombo: e.key, mod, modShift }).catch(() => {});
      }
    };
    const preventDefault = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("contextmenu", preventDefault as EventListener);
    document.addEventListener("copy", preventDefault as EventListener);
    document.addEventListener("cut", preventDefault as EventListener);
    document.addEventListener("selectstart", preventDefault as EventListener);
    document.addEventListener("dragstart", preventDefault as EventListener);

    const threshold = 160;
    const interval = setInterval(() => {
      const suspicious =
        (window.outerWidth - window.innerWidth > threshold) ||
        (window.outerHeight - window.innerHeight > threshold);
      if (suspicious) {
        const v = videoRef.current;
        try { if (v && !v.paused) v.pause(); } catch {}
      }
    }, 600);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("contextmenu", preventDefault as EventListener);
      document.removeEventListener("copy", preventDefault as EventListener);
      document.removeEventListener("cut", preventDefault as EventListener);
      document.removeEventListener("selectstart", preventDefault as EventListener);
      document.removeEventListener("dragstart", preventDefault as EventListener);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let player: any = null;
    let ui: any = null;
    let destroyed = false;

    const setup = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const Shaka = await import("shaka-player/dist/shaka-player.compiled.js").then(m => (m as any).default || (m as any));

      if (!Shaka.supportsMediaKeys) {
        // EME desteklenmiyorsa çık
        return;
      }

      player = new Shaka.Player(video);

      // DRM sunucularını ata
      player.configure({ drm: { servers: { ...licenseServers } } });

      // FairPlay için sertifika ayarı (varsa)
      if (fairplayCertUrl) {
        try {
          const buf = await fetch(fairplayCertUrl).then(r => r.arrayBuffer());
          const cert = new Uint8Array(buf);
          player.configure({
            drm: {
              advanced: {
                "com.apple.fps.1_0": { serverCertificate: cert },
              },
            },
          });
        } catch {}
      }

      // PiP & RemotePlayback engellemeleri
      try {
        (video as any).disablePictureInPicture = true;
        (video as any).disableRemotePlayback = true;
      } catch {}

      // Watermark canvas senkronizasyonu
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
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
        try { ctx.clearRect(0, 0, canvas.width, canvas.height); } catch {}
        t += speed;
        const nameText = `${fullName}`;
        const tcText = `${tcNo}`;
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
        if (Math.floor(t) % 15 < 7) {
          ctx.globalAlpha = 0.35;
          ctx.fillStyle = "rgba(0,0,0,0.35)";
          ctx.fillText(`${fullName} • ${tcNo}`, 24, canvas.height - 36);
          ctx.globalAlpha = 1;
        }
        raf = requestAnimationFrame(draw);
      };
      const onPlay = () => { if (!raf) raf = requestAnimationFrame(draw); };
      const onPause = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } ctx.clearRect(0, 0, canvas.width, canvas.height); };
      video.addEventListener("play", onPlay);
      video.addEventListener("pause", onPause);

      try {
        await player.load(manifestUrl);
      } catch (e) {
        // yüzeysel hata yutulur; kullanıcıya UI tarafında bildirim yapılabilir
      }

      return () => {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener("resize", syncCanvasSize);
        video.removeEventListener("play", onPlay);
        video.removeEventListener("pause", onPause);
      };
    };

    setup();

    return () => {
      destroyed = true;
      try { player?.destroy?.(); } catch {}
      try { ui?.destroy?.(); } catch {}
    };
  }, [manifestUrl, JSON.stringify(licenseServers), fairplayCertUrl, fullName, tcNo, speed]);

  return (
    <div ref={wrapperRef} className="relative w-full aspect-video rounded-xl overflow-hidden bg-black select-none">
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
      />
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />
    </div>
  );
};

export default DrmVideoPlayer;


