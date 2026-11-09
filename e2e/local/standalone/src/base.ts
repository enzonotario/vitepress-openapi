// The app is served at `/` locally and at `/standalone/` in the docs site.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

/** Prefix an app path (`/example/...`) with the base. */
export function withBase(path: string) {
  return `${BASE}${path}`
}

/** Remove the base from a pathname. */
export function withoutBase(pathname: string) {
  return pathname.startsWith(BASE) ? pathname.slice(BASE.length) || '/' : pathname
}
