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
(async () => {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    console.error('DATABASE_URL not found');
    process.exit(1);
  }
  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    const resP = await client.query('SELECT count(*)::int AS count FROM products');
    console.log('products count:', resP.rows[0].count);
    const resPB = await client.query("SELECT id, name, sku, image_url FROM products ORDER BY id LIMIT 5");
    console.table(resPB.rows);
    const resB = await client.query('SELECT count(*)::int AS count FROM blog_posts');
    console.log('blog_posts count:', resB.rows[0].count);
    const resBB = await client.query("SELECT id, title, slug, featured_image FROM blog_posts ORDER BY id LIMIT 5");
    console.table(resBB.rows);
  } catch (err) {
    console.error('error', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
