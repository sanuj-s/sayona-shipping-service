// ═══════════════════════════════════════════════
// Sayona Logistics Platform — Type-Safe API Client
// ═══════════════════════════════════════════════

import type { ApiResponse } from "@/lib/types";

import { useAuthStore } from "@/lib/store/auth-store";

const API_BASE = "/api/v1";

class ApiClientError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }
}

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem("sayona-auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.state?.token) {
        return { Authorization: `Bearer ${parsed.state.token}` };
      }
    }
  } catch {}
  return {};
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const executeRequest = async () => {
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...options.headers,
      },
    };
    return fetch(url, config);
  };

  let response = await executeRequest();

  if (response.status === 401 && typeof window !== "undefined") {
    // Skip refresh for auth endpoints to prevent loops
    if (!endpoint.startsWith("/auth/")) {
      const store = useAuthStore.getState();
      
      if (store.refreshToken && !isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: store.refreshToken }),
          });
          
          if (refreshRes.ok) {
            const resData = await refreshRes.json();
            const tokens = resData.data;
            if (store.user) {
              store.login(store.user, tokens.accessToken, tokens.refreshToken);
            }
            processQueue(null, tokens.accessToken);
            // Retry original request
            response = await executeRequest();
          } else {
            throw new Error("Refresh failed");
          }
        } catch (err) {
          processQueue(err as Error, null);
          const role = store.user?.role;
          store.logout();
          window.location.href = role === "admin" || role === "staff" ? "/admin/login" : "/client/login";
        } finally {
          isRefreshing = false;
        }
      } else if (isRefreshing) {
        try {
          await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          response = await executeRequest();
        } catch (err) {
          // If refresh fails, the queue gets rejected and we land here
        }
      } else {
        const role = store.user?.role;
        store.logout();
        window.location.href = role === "admin" || role === "staff" ? "/admin/login" : "/client/login";
      }
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.error?.message || errorBody?.message || `Request failed with status ${response.status}`;

    throw new ApiClientError(message, response.status, errorBody?.error?.code);
  }

  const json: any = await response.json();
  if (json.data !== undefined) {
    if (Array.isArray(json.data) && json.meta?.total !== undefined) {
      (json.data as any).total = json.meta.total;
    }
    return json.data;
  }
  return json as unknown as T;
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint),

  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
};

export { ApiClientError };
