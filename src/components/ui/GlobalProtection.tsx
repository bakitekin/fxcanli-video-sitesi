"use client";
import React, { useEffect } from "react";
import { logSecurityEvent } from "@/lib/securityLogs";

const GlobalProtection: React.FC = () => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;
      const modShift = (e.ctrlKey || e.metaKey) && e.shiftKey;
      if (
        key === "f12" ||
        (modShift && (key === "i" || key === "j" || key === "k" || key === "c")) ||
        (mod && (key === "u" || key === "s" || key === "p" || key === "o"))
      ) {
        e.preventDefault();
        e.stopPropagation();
        logSecurityEvent("devtools_detected", { keyCombo: e.key, mod, modShift }).catch(()=>{});
      }
    };
    const onCtx = (e: MouseEvent) => e.preventDefault();

    document.addEventListener("keydown", onKey);
    document.addEventListener("contextmenu", onCtx);

    // Pencere odak kaybında oynatmaları durdur
    const onBlur = () => {
      const videos = document.querySelectorAll<HTMLVideoElement>("video");
      videos.forEach(v => {
        try { if (!v.paused) v.pause(); } catch {}
      });
      logSecurityEvent("window_blur").catch(()=>{});
    };
    window.addEventListener("blur", onBlur);

    // Basit çoklu monitör tespiti: büyük dış boyut farkı
    const threshold = 160;
    const interval = setInterval(() => {
      const suspicious =
        (window.outerWidth - window.innerWidth > threshold) ||
        (window.outerHeight - window.innerHeight > threshold);
      if (suspicious) {
        const videos = document.querySelectorAll<HTMLVideoElement>("video");
        videos.forEach(v => {
          try { if (!v.paused) v.pause(); } catch {}
        });
        logSecurityEvent("devtools_detected", { reason: "window-delta" }).catch(()=>{});
      }
    }, 600);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("contextmenu", onCtx);
      window.removeEventListener("blur", onBlur);
      clearInterval(interval);
    };
  }, []);

  return null;
};

export default GlobalProtection;


