-- Add brand column to products table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='brand') THEN
    ALTER TABLE products ADD COLUMN brand VARCHAR(255);
  END IF;
END$$;
