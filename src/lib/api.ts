export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(
  path: string,
  method: HttpMethod = "GET",
  body?: unknown,
  opts?: RequestInit
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
  try {
    const baseInit: RequestInit = {
      method,
      credentials: "include",
      mode: "cors",
      signal: controller.signal,
      ...opts,
    };
    const init: RequestInit =
      method !== "GET"
        ? {
            ...baseInit,
            headers: { "Content-Type": "application/json", ...(opts?.headers || {}) },
            body: body ? JSON.stringify(body) : undefined,
          }
        : baseInit;

    const res = await fetch(`${API_BASE_URL}${path}`, init);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `API error: ${res.status}`);
    }
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return (await res.json()) as T;
    }
    return (await res.text()) as unknown as T;
  } catch (_err) {
    throw new Error("Sunucuya bağlanılamadı. Lütfen backend'i çalıştırın veya NEXT_PUBLIC_API_URL değerini kontrol edin.");
  } finally {
    clearTimeout(timeout);
  }
}

// Auth
export const api = {
  register: (data: {
    full_name: string;
    tc_no: string;
    email: string;
    phone: string;
    password: string;
  }) => request<{ success: boolean }>("/auth/register", "POST", data),
  login: (data: { email: string; password: string }) =>
    request<{ otpRequired?: boolean; success: boolean }>("/auth/login", "POST", data),
  otpVerify: (data: { code: string }) => request<{ success: boolean }>("/auth/otp-verify", "POST", data),
  me: () => request<{ id: string; full_name: string; tc_no: string; membership_end?: string }>("/auth/me"),

  // Videos
  listVideos: () =>
    request<Array<{ id: string; title: string; description?: string }>>("/videos"),
  getStream: (id: string) => request<{ drm_url: string }>(`/videos/stream/${id}`),

  // Admin
  uploadVideo: (payload: { title: string; description?: string; drm_url: string }) =>
    request("/videos", "POST", payload),
  updateVideo: (id: string, payload: Partial<{ title: string; description: string; drm_url: string }>) =>
    request(`/videos/${id}`, "PATCH", payload),

  // Payments
  createPayment: (payload: { packageId: string }) =>
    request<{ iframeUrl: string }>("/payments/create", "POST", payload),
};
