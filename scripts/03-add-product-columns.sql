-- Add missing columns to products table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='full_description') THEN
    ALTER TABLE products ADD COLUMN full_description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='original_price') THEN
    ALTER TABLE products ADD COLUMN original_price DECIMAL(10,2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='image_url') THEN
    ALTER TABLE products ADD COLUMN image_url VARCHAR(500);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='in_stock') THEN
    ALTER TABLE products ADD COLUMN in_stock BOOLEAN DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='stock_quantity') THEN
    ALTER TABLE products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='badge') THEN
    ALTER TABLE products ADD COLUMN badge VARCHAR(100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='status') THEN
    ALTER TABLE products ADD COLUMN status VARCHAR(50) DEFAULT 'inactive';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='specifications') THEN
    ALTER TABLE products ADD COLUMN specifications JSONB;
  END IF;
END$$;
