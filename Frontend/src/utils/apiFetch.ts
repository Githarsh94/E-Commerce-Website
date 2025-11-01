// Lightweight fetch wrapper that attaches Authorization header when a JWT is present
export async function apiFetch(input: string, init?: RequestInit) {
  // Default to local backend if env var not provided
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3002';
  // If path starts with /api, prefix with backend URL
  let url = input;
  if (input.startsWith('/api')) url = `${backendUrl}${input}`;

  const headers = new Headers(init?.headers || {});

  // If body is an object and Content-Type not provided, assume JSON
  // If a body is provided and Content-Type not set, assume JSON.
  // Accept both stringified JSON and object bodies.
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = localStorage.getItem('token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, { ...(init || {}), headers });
  if (!res.ok) {
    const text = await res.text();
    let body: any = text;
    try { body = JSON.parse(text); } catch {}
    const err: any = new Error(body?.error || res.statusText || 'Request failed');
    err.status = res.status;
    err.body = body;
    throw err;
  }

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export default apiFetch;
