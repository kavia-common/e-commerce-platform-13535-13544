/**
 * Small wrapper around localStorage with JSON parsing/stringifying and namespacing.
 */
const NS = 'ecomm';

export function save(key, value) {
  try {
    localStorage.setItem(`${NS}:${key}`, JSON.stringify(value));
  } catch (_) {}
}

export function load(key, fallback) {
  try {
    const v = localStorage.getItem(`${NS}:${key}`);
    return v ? JSON.parse(v) : fallback;
  } catch (_) {
    return fallback;
  }
}

export function remove(key) {
  try { localStorage.removeItem(`${NS}:${key}`); } catch (_) {}
}
