export function safeParseJson<T = unknown>(input: string, label: string) {
  try {
    return {
      value: JSON.parse(input) as T,
      error: null as string | null,
    }
  } catch {
    return {
      value: null as T | null,
      error: `${label} must be valid JSON.`,
    }
  }
}

export function isValidSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

export function isValidHref(value: string) {
  if (!value.trim()) return false
  return value.startsWith('/') || /^https?:\/\//.test(value)
}

export function isValidUrl(value: string) {
  if (!value.trim()) return false
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}
