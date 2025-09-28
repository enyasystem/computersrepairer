import fs from "fs/promises";
import path from "path";
import { sql } from "./database";
import bcrypt from "bcryptjs";

export type AdminCreds = {
  username: string;
  email?: string;
  password?: string; // plaintext only used for fallback; prefer DB with hashed password
};

const CREDS_PATH = path.resolve(process.cwd(), "data", "admin-creds.json");

async function readFileCreds(): Promise<AdminCreds | null> {
  try {
    const raw = await fs.readFile(CREDS_PATH, "utf-8");
    return JSON.parse(raw) as AdminCreds;
  } catch (err) {
    return null;
  }
}

async function writeFileCreds(updates: Partial<AdminCreds>) {
  try {
    const current = (await readFileCreds()) || { username: process.env.ADMIN_USERNAME || "admin", password: process.env.ADMIN_PASSWORD || "" };
    const merged = { ...current, ...updates };
    await fs.mkdir(path.dirname(CREDS_PATH), { recursive: true });
    await fs.writeFile(CREDS_PATH, JSON.stringify(merged, null, 2), "utf-8");
    return merged;
  } catch (err) {
    throw err;
  }
}

export async function getAdminCreds() {
  // Try DB first (if sql client is available and connection info present)
  try {
    // simple existence check: attempt a lightweight query
    const res = await sql`SELECT id, username, email, is_active FROM admins LIMIT 1`;
    if (res && res.length > 0) {
      // Return the first admin's public info (no password)
      const a = res[0];
      return { username: a.username, email: a.email };
    }
  } catch (err) {
    // DB not available or table missing: fall back to file
  }

  const file = await readFileCreds();
  if (file) return file;

  // final fallback to env
  return { username: process.env.ADMIN_USERNAME || "admin", email: process.env.ADMIN_EMAIL };
}

export async function setAdminCreds(updates: Partial<AdminCreds>) {
  // Try to persist to DB admins table if possible
  try {
    // If we were given a password in plaintext, callers should hash before calling this function.
    if (updates.password) {
      // If DB is available, do not store plaintext in file. Instead, upsert into admins with a placeholder hash - caller should supply hashed password via other helper.
      // We'll attempt to update by email or username if provided.
      const existing = updates.email ? await sql`SELECT id FROM admins WHERE email = ${updates.email} LIMIT 1` : updates.username ? await sql`SELECT id FROM admins WHERE username = ${updates.username} LIMIT 1` : null;
      if (existing && existing.length > 0) {
        const id = existing[0].id;
        // naive update - expects caller hashed password in updates.password (not ideal). Keep file fallback below.
        await sql`UPDATE admins SET password_hash = ${updates.password}, email = COALESCE(${updates.email}, email), username = COALESCE(${updates.username}, username), updated_at = NOW() WHERE id = ${id}`;
        return { username: updates.username, email: updates.email };
      }
    }

    // If no password provided or DB unavailable for write, update file fallback
    return await writeFileCreds(updates);
  } catch (err) {
    // fallback to file
    return await writeFileCreds(updates);
  }
}

export async function createAdminInDb(username: string, email: string, password: string, role = 'owner') {
  // Hash the password and insert or upsert into admins table
  const hash = await bcrypt.hash(password, 10)
  try {
    await sql`
      INSERT INTO admins (username, email, password_hash, role, is_active)
      VALUES (${username}, ${email}, ${hash}, ${role}, true)
      ON CONFLICT (username) DO UPDATE SET
        email = EXCLUDED.email,
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active,
        updated_at = NOW()
    `
    return { username, email }
  } catch (err) {
    console.error('createAdminInDb error', err)
    throw err
  }
}
