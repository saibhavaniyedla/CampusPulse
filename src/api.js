
const API_BASE = 'http://127.0.0.1:8000/api';

export const getToken = () =>
  localStorage.getItem('campuspulse_token');

export async function api(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error('API error:', response.status, payload);
    throw new Error(
      payload.detail || payload.message || `HTTP ${response.status}`
    );
  }

  return payload;
}
