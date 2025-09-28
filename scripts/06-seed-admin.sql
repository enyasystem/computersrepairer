-- Seed initial admin using PostgreSQL's pgcrypto to hash the password
-- Default credentials: username: admin, email: admin@example.com, password: password

-- Enable pgcrypto extension if available (requires superuser or allowed on managed DBs)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO admins (username, email, password_hash, role, is_active)
VALUES (
  'admin',
  'admin@computersrepairer.com',
  crypt('admin123', gen_salt('bf', 10)),
  'owner',
  true
)
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
