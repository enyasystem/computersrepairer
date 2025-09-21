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
  const sqlFiles = [
    path.resolve(__dirname, '00-clean-products-blog.sql'),
    path.resolve(__dirname, '01-create-tables.sql'),
    path.resolve(__dirname, '03-add-product-columns.sql'),
    path.resolve(__dirname, '04-add-brand-column.sql'),
    path.resolve(__dirname, '02-seed-data.sql'),
  ];

  try {
    await client.connect();
    console.log('Connected to database. Running SQL files...');

    for (const file of sqlFiles) {
      if (!fs.existsSync(file)) {
        console.warn(`SQL file not found, skipping: ${file}`);
        continue;
      }
      const sql = fs.readFileSync(file, 'utf8');
      console.log(`\n--- Running ${path.basename(file)} ---`);
      await client.query(sql);
      console.log(`--- Finished ${path.basename(file)} ---`);
    }

    console.log('\nAll seed files executed successfully.');
  } catch (err) {
    console.error('Error running seed files:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
