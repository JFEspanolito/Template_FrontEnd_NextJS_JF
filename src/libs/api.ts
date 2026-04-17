import { toast } from "react-hot-toast";
import configApiPublic from "@/data/configApi.public";

const AUTH_CALLBACK_URL = configApiPublic.auth.callbackUrl;

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, ...rest } = options;

  const res = await fetch(`/api${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...rest.headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    toast.error("Please login");
    window.location.href = `/signin?redirectTo=${encodeURIComponent(AUTH_CALLBACK_URL)}`;
    return Promise.reject(new Error("Unauthorized"));
  }

  if (res.status === 403) {
    const message = "Pick a plan to use this feature";
    toast.error(message);
    return Promise.reject(new Error(message));
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = data?.error || res.statusText || "Something went wrong";
    toast.error(message);
    return Promise.reject(new Error(message));
  }

  return res.json() as Promise<T>;
}

const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

export default apiClient;
