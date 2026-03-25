const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

export async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message ?? "Request failed";
    throw new Error(message);
  }

  return data;
}
