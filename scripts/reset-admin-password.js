#!/usr/bin/env node
// Reset or create an admin user by username using bcrypt and pg.
// Usage: DATABASE_URL="<db-url>" node scripts/reset-admin-password.js <username> <newPassword> [email]

const { Client } = require('pg')
const bcrypt = require('bcryptjs')

async function main() {
  const [,, username, password, emailArg] = process.argv
  if (!username || !password) {
    console.error('Usage: DATABASE_URL="<db-url>" node scripts/reset-admin-password.js <username> <newPassword> [email]')
    process.exit(1)
  }

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('Please set DATABASE_URL environment variable.')
    process.exit(1)
  }

  const client = new Client({ connectionString: databaseUrl })
  await client.connect()
  try {
    const hash = await bcrypt.hash(password, 10)

    // Try to update existing user
    const updateRes = await client.query(
      'UPDATE admins SET password_hash = $1, updated_at = NOW() WHERE username = $2 RETURNING id, username, email',
      [hash, username]
    )

    if (updateRes.rowCount > 0) {
      console.log(`Updated password for admin '${username}'.`)
      console.log('id:', updateRes.rows[0].id, 'email:', updateRes.rows[0].email)
      process.exit(0)
    }

    // If not found, insert a new admin row
    const email = emailArg || `${username}@example.com`
    const insertRes = await client.query(
      'INSERT INTO admins (username, email, password_hash, role, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, true, NOW(), NOW()) RETURNING id, username, email',
      [username, email, hash, 'owner']
    )

    if (insertRes.rowCount > 0) {
      console.log(`Created admin '${username}' with email '${email}'.`)
      console.log('id:', insertRes.rows[0].id)
      process.exit(0)
    }

    console.error('No rows updated or created')
    process.exit(2)
  } catch (err) {
    console.error('Error resetting admin password:', err)
    process.exit(3)
  } finally {
    await client.end()
  }
}

main()
