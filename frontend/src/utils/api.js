// Centralized API helper that prefixes requests with a build-time base URL
// Configure via VITE_API_BASE (set at build time in Dockerfile/compose)

const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`
  return fetch(url, options)
}


