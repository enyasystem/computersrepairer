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
  const sqlFile = path.resolve(__dirname, 'seed-image-urls.sql');

  if (!fs.existsSync(sqlFile)) {
    console.error('Mapping SQL file not found:', sqlFile);
    process.exit(1);
  }

  try {
    await client.connect();
    console.log('Connected to database. Applying image mapping SQL...');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    // Execute as a single query; pg will handle multi-statement SQL when separated by semicolons
    await client.query(sql);
    console.log('Applied mapping SQL successfully.');
  } catch (err) {
    console.error('Error applying mapping SQL:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
