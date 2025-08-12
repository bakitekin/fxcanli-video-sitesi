"use client";
import React, { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  src: string; // drm url veya proxy
  fullName: string;
  tcNo: string;
  speed?: number; // 0.1 - 2.0
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, fullName, tcNo, speed = 0.6 }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // İndirme/PiP/Remote playback engelle
    try {
      // @ts-ignore
      video.disablePictureInPicture = true;
      // @ts-ignore
      video.disableRemotePlayback = true;
    } catch {}

    // Sağ tık ve sürükleme devre dışı
    const prevent = (e: Event) => e.preventDefault();
    video.addEventListener("contextmenu", prevent);
    video.addEventListener("dragstart", prevent);

    let raf = 0;
    let t = 0;

    const onResize = () => {
      const rect = video.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      setSize({ w: rect.width, h: rect.height });
    };
    onResize();
    window.addEventListener("resize", onResize);

    const draw = () => {
      t += speed; // hız
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Hareketli overlay (daha yavaş sin dalgası)
      const text = `${fullName} • ${tcNo}`;
      ctx.font = "bold 16px Kodchasan, sans-serif";
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.textBaseline = "top";

      const x = (t * 0.8) % (canvas.width + 200) - 100;
      const y = 20 + Math.sin(t / 45) * 12 + ((t / 480) % 1) * (canvas.height - 60);
      ctx.fillText(text, x, Math.max(10, Math.min(canvas.height - 30, y)));

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      video.removeEventListener("contextmenu", prevent);
      video.removeEventListener("dragstart", prevent);
    };
  }, [fullName, tcNo, speed]);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black select-none">
      <video
        ref={videoRef}
        controls
        className="w-full h-full object-contain"
        playsInline
        controlsList="nodownload noplaybackrate noremoteplayback"
        onContextMenu={(e)=>e.preventDefault()}
      >
        <source src={src} />
      </video>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
};

export default VideoPlayer;
