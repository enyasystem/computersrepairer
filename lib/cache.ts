import Redis from 'ioredis'

const redisUrl = process.env.REDIS_URL
let redis: InstanceType<typeof Redis> | null = null

if (redisUrl) {
  try {
    redis = new Redis(redisUrl)
    redis.on('error', (err: Error) => console.warn('[v0] Redis error', err))
    console.log('[v0] Using Redis cache at', redisUrl)
  } catch (e: unknown) {
    console.warn('[v0] Failed to initialize Redis, falling back to in-memory cache', e)
    redis = null
  }
} else {
  console.log('[v0] REDIS_URL not set, using in-memory cache')
}

// Simple in-memory Map fallback
const localCache = new Map<string, { ts: number; ttl: number; data: any }>()

export async function cacheGet(key: string): Promise<any | null> {
  if (redis) {
    try {
      const raw = await redis.get(key)
      if (!raw) return null
      return JSON.parse(raw)
    } catch (e: unknown) {
      console.warn('[v0] Redis get failed', e)
      return null
    }
  }
  const v = localCache.get(key)
  if (!v) return null
  if (Date.now() - v.ts > (v.ttl || 30000)) {
    localCache.delete(key)
    return null
  }
  return v.data
}

export async function cacheSet(key: string, value: any, ttl = 30000): Promise<boolean> {
  if (redis) {
    try {
      await redis.set(key, JSON.stringify(value), 'PX', ttl)
      return true
    } catch (e: unknown) {
      console.warn('[v0] Redis set failed', e)
      return false
    }
  }
  localCache.set(key, { ts: Date.now(), ttl, data: value })
  return true
}

export async function cacheDel(key: string): Promise<boolean> {
  if (redis) {
    try {
      await redis.del(key)
      return true
    } catch (e: unknown) {
      console.warn('[v0] Redis del failed', e)
      return false
    }
  }
  return localCache.delete(key)
}

export async function cacheClearPrefix(prefix: string) {
  if (redis) {
    try {
      const keys = await redis.keys(`${prefix}*`)
      if (keys.length) await redis.del(...keys)
      return true
    } catch (e: unknown) {
      console.warn('[v0] Redis clear prefix failed', e)
      return false
    }
  }
  // local fallback: delete matching keys
  for (const k of Array.from(localCache.keys())) {
    if (k.startsWith(prefix)) localCache.delete(k)
  }
  return true
}
