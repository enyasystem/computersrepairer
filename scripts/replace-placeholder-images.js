const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const envPath = path.resolve(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return null;
  const content = fs.readFileSync(envPath, 'utf8');
  const m = content.match(/^DATABASE_URL=(.+)$/m);
  return m ? m[1].trim() : null;
}

const OUT_DIR = path.resolve(__dirname, '..', 'public', 'seed-images');

(async () => {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    console.error('DATABASE_URL not found in environment or .env.local');
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    console.log('Connected to DB — scanning products with placeholder image URLs...');

    const res = await client.query(`SELECT id, sku, image_url FROM products WHERE image_url LIKE '%loremflickr.com%' OR image_url LIKE '%placehold.co%' OR image_url LIKE '%via.placeholder.com%' OR image_url LIKE '%dummyimage.com%'`);
    if (!res.rows.length) {
      console.log('No products found with common placeholder image hosts.');
      return;
    }

    let updated = 0;
    for (const row of res.rows) {
      const sku = row.sku;
      // try .jpg then .png
      const jpg = path.join(OUT_DIR, `${sku}.jpg`);
      const png = path.join(OUT_DIR, `${sku}.png`);
      let newUrl = null;
      if (fs.existsSync(jpg)) newUrl = `/seed-images/${sku}.jpg`;
      else if (fs.existsSync(png)) newUrl = `/seed-images/${sku}.png`;

      if (newUrl) {
        await client.query('UPDATE products SET image_url = $1 WHERE id = $2', [newUrl, row.id]);
        console.log(`Updated product ${sku} -> ${newUrl}`);
        updated++;
      } else {
        console.log(`No local image found for ${sku}`);
      }
    }

    console.log(`Finished. Updated ${updated} product(s).`);
  } catch (err) {
    console.error('Error:', err.message || err);
  } finally {
    await client.end();
  }
})();
