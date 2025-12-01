// Local in-memory cache implementation only (no Redis)
// This project does not use Redis; keep a simple async API to match callers.

const localCache = new Map<string, { ts: number; ttl: number; data: any }>()

export async function cacheGet(key: string): Promise<any | null> {
  const v = localCache.get(key)
  if (!v) return null
  if (Date.now() - v.ts > (v.ttl || 30000)) {
    localCache.delete(key)
    return null
  }
  return v.data
}

export async function cacheSet(key: string, value: any, ttl = 30000): Promise<boolean> {
  localCache.set(key, { ts: Date.now(), ttl, data: value })
  return true
}

export async function cacheDel(key: string): Promise<boolean> {
  return localCache.delete(key)
}

export async function cacheClearPrefix(prefix: string) {
  for (const k of Array.from(localCache.keys())) {
    if (k.startsWith(prefix)) localCache.delete(k)
  }
  return true
}
