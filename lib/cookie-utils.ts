// Cookie helpers
export interface CookieOptions {
  /** Max-age in seconds */
  maxAge?: number
  /** Cookie path (defaults to "/") */
  path?: string
}

// Set a cookie (client-side only)
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === "undefined") return

  const { maxAge, path = "/" } = options
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path}`
  if (typeof maxAge === "number") {
    cookie += `; max-age=${maxAge}`
  }
  document.cookie = cookie
}

// Get cookie value (client-side only)
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

// Remove cookie (client-side only)
export function removeCookie(name: string): void {
  if (typeof document === "undefined") return
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; path=/`
}

// Parse and return user data that may be stored inside the "user" cookie
export function getUserDataFromCookie(): any | null {
  const raw = getCookie("user")
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
} 