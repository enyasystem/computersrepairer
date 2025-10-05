#!/usr/bin/env node
/**
 * fetch-seed-images.mjs
 *
 * Attempts to fetch representative images for seed data using multiple sources:
 *  1) Unsplash API (requires UNSPLASH_ACCESS_KEY in .env.local)
 *  2) Google Custom Search JSON API (requires GOOGLE_API_KEY and GOOGLE_CX)
 *  3) Fallback providers: picsum.photos, placehold.co, via.placeholder.com, dummyimage.com
 *
 * The script reads `scripts/seed-image-mapping.json` for keywords per SKU/slug,
 * downloads images to `public/seed-images/<key>.<ext>`, and emits `scripts/seed-image-urls.sql`
 * which contains UPDATE statements to set image_url for each SKU/slug.
 *
 * Usage (local):
 *   - Copy .env.example to .env.local and set UNSPLASH_ACCESS_KEY and/or GOOGLE_API_KEY & GOOGLE_CX
 *   - npm install node-fetch@2 mkdirp dotenv
 *   - node scripts/fetch-seed-images.mjs
 */

import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') })

const MAP_FILE = path.resolve(process.cwd(), 'scripts', 'seed-image-mapping.json')
const OUT_DIR = path.resolve(process.cwd(), 'public', 'seed-images')
const OUT_SQL = path.resolve(process.cwd(), 'scripts', 'seed-image-urls.sql')

if (!fs.existsSync(MAP_FILE)) {
  console.error('Mapping file not found:', MAP_FILE)
  process.exit(1)
}

const mapping = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'))

// --- Auto-discover SKUs and slugs from seed SQL files and extend mapping ---
function extractQuotedStrings(tuple) {
  const strs = []
  let i = 0
  while (i < tuple.length) {
    const ch = tuple[i]
    if (ch === "'") {
      i++
      let buf = ''
      while (i < tuple.length) {
        const c = tuple[i]
        if (c === "'") {
          // escaped single-quote in SQL is two single quotes
          if (tuple[i + 1] === "'") {
            buf += "'"
            i += 2
            continue
          }
          i++
          break
        }
        buf += c
        i++
      }
      strs.push(buf)
    } else {
      i++
    }
  }
  return strs
}

function humanizeKey(key) {
  // Replace dashes/underscores with spaces and remove common SKU prefixes if present
  return key.replace(/[-_]+/g, ' ').replace(/\bCPU\b/gi, 'CPU').replace(/\bSSD\b/gi, 'SSD')
}

function extendMappingFromSeed(seedPath) {
  if (!fs.existsSync(seedPath)) return
  const content = fs.readFileSync(seedPath, 'utf8')

  // Products: find the INSERT INTO products ... VALUES (...) ON CONFLICT block
  const prodMatch = content.match(/INSERT INTO products[\s\S]*?VALUES([\s\S]*?)ON CONFLICT/i)
  if (prodMatch) {
    const tuplesBlock = prodMatch[1]
    // split tuples by \),\s*\n or '),\n\n' boundaries
    const tuples = tuplesBlock.split(/\),\s*\n/) // keep it simple
    for (const t of tuples) {
      const strs = extractQuotedStrings(t)
      // fields: name, description, category, price, stock_quantity, sku, image_url, is_active
      if (strs.length >= 6) {
        const sku = strs[5]
        if (sku && /^[A-Z0-9\-]{3,}$/.test(sku)) {
          if (!mapping.products) mapping.products = {}
          if (!mapping.products[sku]) {
            mapping.products[sku] = [humanizeKey(sku)]
          }
        }
      }
    }
  }

  // Blog posts: find INSERT INTO blog_posts ... VALUES (...) ON CONFLICT block
  const blogMatch = content.match(/INSERT INTO blog_posts[\s\S]*?VALUES([\s\S]*?)ON CONFLICT/i)
  if (blogMatch) {
    const tuplesBlock = blogMatch[1]
    const tuples = tuplesBlock.split(/\),\s*\n/)
    for (const t of tuples) {
      const strs = extractQuotedStrings(t)
      // fields: title, slug, content, excerpt, featured_image, status, published_at
      if (strs.length >= 2) {
        const slug = strs[1]
        if (slug && /^[a-z0-9\-]{3,}$/.test(slug)) {
          if (!mapping.blog_posts) mapping.blog_posts = {}
          if (!mapping.blog_posts[slug]) {
            mapping.blog_posts[slug] = [slug.replace(/-/g, ' ')]
          }
        }
      }
    }
  }
}

// Extend mapping by scanning both seed files (if present)
extendMappingFromSeed(path.resolve(process.cwd(), 'scripts', '02-seed-data.sql'))
extendMappingFromSeed(path.resolve(process.cwd(), 'scripts', '02b-seed-more-products-and-posts.sql'))

// Persist mapping back to file so future runs include discovered keys
try {
  fs.writeFileSync(MAP_FILE, JSON.stringify(mapping, null, 2) + '\n')
  console.log('Extended mapping written to', MAP_FILE)
} catch (err) {
  console.warn('Could not write mapping file:', err.message)
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

ensureDir(OUT_DIR)

const unsplashKey = process.env.UNSPLASH_ACCESS_KEY
const googleKey = process.env.GOOGLE_API_KEY
const googleCx = process.env.GOOGLE_CX

async function tryUnsplash(query) {
  if (!unsplashKey) return null
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${unsplashKey}` } })
  if (!res.ok) return null
  const data = await res.json()
  const result = data?.results?.[0]
  return result ? result.urls.raw + '&w=1200&q=80&fm=jpg' : null
}

async function tryGoogleImage(query) {
  if (!googleKey || !googleCx) return null
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${googleCx}&searchType=image&num=1&safe=off&imgSize=large&key=${googleKey}`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  const item = data?.items?.[0]
  return item?.link || null
}

function fallbackForKey(key, idx = 0) {
  const providers = [
    `https://picsum.photos/seed/${encodeURIComponent(key)}/1200/800`,
    `https://placehold.co/1200x800/eeeeee/000000?text=${encodeURIComponent(key)}`,
    `https://via.placeholder.com/1200x800.png?text=${encodeURIComponent(key)}`,
    `https://dummyimage.com/1200x800/cccccc/000000.png&text=${encodeURIComponent(key)}`,
    `https://loremflickr.com/1200/800/${encodeURIComponent(key)}`,
  ]
  return providers[idx % providers.length]
}

async function downloadToFile(url, outPath) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buffer = await res.arrayBuffer()
    fs.writeFileSync(outPath, Buffer.from(buffer))
    return true
  } catch (err) {
    console.warn('Download failed for', url, err.message || err)
    return false
  }
}

async function processMapSection(sectionName, entries) {
  const sqlLines = []
  for (const key of Object.keys(entries)) {
    const keywords = entries[key]
    let foundUrl = null
    // try keywords via unsplash/google
    for (const kw of keywords) {
      if (!foundUrl && unsplashKey) {
        foundUrl = await tryUnsplash(kw)
        if (foundUrl) break
      }
      if (!foundUrl && googleKey && googleCx) {
        foundUrl = await tryGoogleImage(kw)
        if (foundUrl) break
      }
    }

    // fallback rotation
    let fallbackIdx = 0
    while (!foundUrl && fallbackIdx < 5) {
      const fb = fallbackForKey(key, fallbackIdx)
      // don't try to download remote for Google/Unsplash-like urls; we'll just use URL
      foundUrl = fb
      fallbackIdx++
    }

    // download image to public/seed-images
    const ext = foundUrl && foundUrl.includes('.png') ? 'png' : 'jpg'
    const outName = `${key}.${ext}`
    const outPath = path.join(OUT_DIR, outName)
    const downloaded = await downloadToFile(foundUrl, outPath)
    const urlForSql = downloaded ? `/seed-images/${outName}` : foundUrl

    if (sectionName === 'products') {
      // set image_url by sku
      sqlLines.push(`UPDATE products SET image_url = '${urlForSql}' WHERE sku = '${key}';`)
    } else if (sectionName === 'blog_posts') {
      // set featured_image by slug
      sqlLines.push(`UPDATE blog_posts SET featured_image = '${urlForSql}' WHERE slug = '${key}';`)
    } else if (sectionName === 'blog_posts' || sectionName === 'blog') {
      sqlLines.push(`UPDATE blog_posts SET featured_image = '${urlForSql}' WHERE slug = '${key}';`)
    }
    console.log(`Processed ${sectionName} ${key} -> ${urlForSql}`)
  }
  return sqlLines
}

async function main() {
  const allSql = []
  if (mapping.products) {
    const lines = await processMapSection('products', mapping.products)
    allSql.push(...lines)
  }
  if (mapping.blog_posts) {
    const lines = await processMapSection('blog_posts', mapping.blog_posts)
    allSql.push(...lines)
  } else if (mapping.blog) {
    const lines = await processMapSection('blog_posts', mapping.blog)
    allSql.push(...lines)
  }

  if (allSql.length) fs.writeFileSync(OUT_SQL, allSql.join('\n') + '\n')
  console.log('Wrote', OUT_SQL)
}

main().catch((err) => {
  console.error('Error', err)
  process.exit(1)
})
