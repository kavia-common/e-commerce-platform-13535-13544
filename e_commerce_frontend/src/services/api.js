/**
 * Lightweight API client wrapper using fetch and .env base URL.
 */
const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

function buildUrl(path) {
  if (!BASE_URL) return path;
  return `${BASE_URL.replace(/\/+$/,'')}/${path.replace(/^\/+/, '')}`;
}

async function request(path, { method = 'GET', body, token, headers = {} } = {}) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    }
  };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) opts.body = typeof body === 'string' ? body : JSON.stringify(body);

  const res = await fetch(buildUrl(path), opts);
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = text; }

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// PUBLIC_INTERFACE
export const api = {
  /** PUBLIC_INTERFACE: Get list of products with optional params (search, category, minPrice, maxPrice, sort) */
  listProducts: (params = {}) => {
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([,v]) => v !== '' && v !== undefined)));
    const path = qs.toString() ? `/products?${qs}` : '/products';
    return request(path);
  },
  /** PUBLIC_INTERFACE: Get a single product by id */
  getProduct: (id) => request(`/products/${encodeURIComponent(id)}`),
  /** PUBLIC_INTERFACE: Auth endpoints */
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (name, email, password) => request('/auth/register', { method: 'POST', body: { name, email, password } }),
  me: (token) => request('/auth/me', { token }),
  /** PUBLIC_INTERFACE: Orders */
  createOrder: (payload, token) => request('/orders', { method: 'POST', body: payload, token }),
  listOrders: (token) => request('/orders', { token }),
};
