import { supabase } from "@/lib/supabaseClient";

type SecurityEventType =
  | "devtools_detected"
  | "screen_recording_attempt"
  | "window_blur"
  | "fullscreen_toggle";

export async function logSecurityEvent(event: SecurityEventType, data?: Record<string, unknown>) {
  try {
    if (!supabase) return; // env eksikse sessiz çık
    await supabase.from("security_logs").insert({
      event,
      data: data || {},
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      created_at: new Date().toISOString(),
    });
  } catch {}
}


