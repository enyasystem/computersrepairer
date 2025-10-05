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
    console.error('DATABASE_URL not found in environment or .env.local');
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });

  try {
    await client.connect();
    console.log('Connected to database. Running image counts...');

    const resProducts = await client.query(`SELECT COUNT(*)::int AS total, COUNT(image_url) FILTER (WHERE image_url IS NOT NULL AND image_url <> '')::int AS with_image FROM products`);
    const resBlogs = await client.query(`SELECT COUNT(*)::int AS total, COUNT(featured_image) FILTER (WHERE featured_image IS NOT NULL AND featured_image <> '')::int AS with_image FROM blog_posts`);

    console.log('Products: ', resProducts.rows[0]);
    console.log('Blog posts:', resBlogs.rows[0]);
  } catch (err) {
    console.error('Error checking images:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
