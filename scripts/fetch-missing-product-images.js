const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const fetch = require('node-fetch');

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const envPath = path.resolve(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return null;
  const content = fs.readFileSync(envPath, 'utf8');
  const m = content.match(/^DATABASE_URL=(.+)$/m);
  return m ? m[1].trim() : null;
}

// Load .env.local (basic)
function loadDotEnv() {
  const envPath = path.resolve(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) {
      const k = m[1].trim();
      let v = m[2].trim();
      // strip optional surrounding quotes
      if ((v.startsWith("\"") && v.endsWith("\"")) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  });
}

loadDotEnv();

const OUT_DIR = path.resolve(__dirname, '..', 'public', 'seed-images');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
const googleKey = process.env.GOOGLE_API_KEY;
const googleCx = process.env.GOOGLE_CX;

async function tryUnsplash(query) {
  if (!unsplashKey) return null;
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${unsplashKey}` } });
  if (!res.ok) return null;
  const data = await res.json();
  const result = data && data.results && data.results[0];
  return result ? result.urls.raw + '&w=1200&q=80&fm=jpg' : null;
}

async function tryGoogleImage(query) {
  if (!googleKey || !googleCx) return null;
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${googleCx}&searchType=image&num=1&safe=off&imgSize=large&key=${googleKey}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  return json?.items?.[0]?.link || null;
}

function fallbackForKey(key, idx = 0) {
  const providers = [
    `https://picsum.photos/seed/${encodeURIComponent(key)}/1200/800`,
    `https://placehold.co/1200x800/eeeeee/000000?text=${encodeURIComponent(key)}`,
    `https://via.placeholder.com/1200x800.png?text=${encodeURIComponent(key)}`,
    `https://dummyimage.com/1200x800/cccccc/000000.png&text=${encodeURIComponent(key)}`,
    `https://loremflickr.com/1200/800/${encodeURIComponent(key)}`,
  ];
  return providers[idx % providers.length];
}

async function download(url, outPath) {
  try {
    const res = await fetch(url, { timeout: 20000 });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(outPath, Buffer.from(buffer));
    return true;
  } catch (err) {
    console.warn('Download failed for', url, err.message || err);
    return false;
  }
}

function humanizeSku(sku) {
  return sku.replace(/[-_]+/g, ' ');
}

(async () => {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    console.error('DATABASE_URL not found');
    process.exit(1);
  }
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    // Find products whose image_url is not local (doesn't start with /seed-images/)
    const q = `SELECT id, sku, image_url FROM products WHERE image_url IS NOT NULL AND image_url NOT LIKE '/seed-images/%'`;
    const res = await client.query(q);
    console.log(`Found ${res.rows.length} product(s) with external images`);

    let updated = 0;
    for (const row of res.rows) {
      const sku = row.sku;
      if (!sku) continue;
      const key = humanizeSku(sku);
      let found = null;

      if (unsplashKey) {
        found = await tryUnsplash(key);
      }
      if (!found && googleKey && googleCx) {
        found = await tryGoogleImage(key);
      }
      // fallback rotation
      let fIdx = 0;
      while (!found && fIdx < 5) {
        found = fallbackForKey(sku, fIdx);
        fIdx++;
      }

      const ext = found && found.includes('.png') ? 'png' : 'jpg';
      const outName = `${sku}.${ext}`;
      const outPath = path.join(OUT_DIR, outName);
      const ok = await download(found, outPath);
      const newUrl = ok ? `/seed-images/${outName}` : found;
      await client.query('UPDATE products SET image_url = $1 WHERE id = $2', [newUrl, row.id]);
      console.log(`Updated ${sku} -> ${newUrl}`);
      updated++;
    }
    console.log(`Finished. Updated ${updated} products.`);
  } catch (err) {
    console.error('Error', err.message || err);
  } finally {
    await client.end();
  }
})();
