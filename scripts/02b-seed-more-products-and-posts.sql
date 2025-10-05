-- Additional products (35 items) to bring total to ~50 products
INSERT INTO products (name, description, category, price, stock_quantity, sku, image_url, is_active)
VALUES
('AMD Ryzen 7 5800X', 'High-performance CPU for gaming and content creation', 'CPU', 200000.00, 12, 'CPU-AMD-R7-5800X', 'https://images.unsplash.com/photo-1624299046202-2a8f4a8dbb6c?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Intel Core i5-12400', 'Balanced CPU for general productivity and light gaming', 'CPU', 120000.00, 20, 'CPU-INTEL-I5-12400', 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('ASUS ROG Strix Motherboard', 'Gaming motherboard with robust power delivery', 'Motherboard', 150000.00, 7, 'MB-ASUS-ROG-STRIX', 'https://images.unsplash.com/photo-1555949963-1f95f5e5b7f4?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('G.SKILL Trident Z 32GB', 'High-speed DDR4 RAM kit (2x16GB)', 'Memory', 85000.00, 15, 'RAM-GSKILL-32GB', 'https://images.unsplash.com/photo-1587202372775-1f1b8a6f9c6b?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Samsung 980 Pro 2TB', 'High-end NVMe SSD for fast storage', 'Storage', 200000.00, 6, 'SSD-SAMSUNG-980-2TB', 'https://images.unsplash.com/photo-1587202372775-1f1b8a6f9c6b?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Crucial MX500 1TB', 'Reliable SATA SSD for everyday use', 'Storage', 65000.00, 18, 'SSD-CRUCIAL-MX500-1TB', 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('MSI Gaming GPU RTX 3070', 'Powerful GPU for 1440p gaming', 'Graphics', 350000.00, 5, 'GPU-MSI-RTX3070', 'https://images.unsplash.com/photo-1618360125622-9d68f16a0f3d?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('ASRock B550 Motherboard', 'Affordable AM4 motherboard', 'Motherboard', 45000.00, 10, 'MB-ASROCK-B550', 'https://images.unsplash.com/photo-1555949963-1f95f5e5b7f4?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Be Quiet! Pure Rock 2', 'Efficient CPU air cooler', 'Cooling', 25000.00, 20, 'COOL-BQ-PURE-ROCK-2', 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Corsair LL120 RGB Fan (3-pack)', 'RGB cooling fans for cases', 'Cooling', 18000.00, 25, 'FAN-CORSAIR-LL120-3PK', 'https://images.unsplash.com/photo-1545231028-1335d9b7b3a3?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('NZXT H510 Case', 'Sleek mid-tower case with good airflow', 'Case', 60000.00, 11, 'CASE-NZXT-H510', 'https://images.unsplash.com/photo-1545231028-1335d9b7b3a3?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Seasonic S12III 650W PSU', 'Efficient power supply with solid build', 'Power', 40000.00, 14, 'PSU-SEASONIC-650W', 'https://images.unsplash.com/photo-1582201961738-3d6d9b3b2f5b?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Logitech C920 Webcam', '1080p webcam for meetings and streaming', 'Peripherals', 25000.00, 30, 'CAM-LOGI-C920', 'https://images.unsplash.com/photo-1545231028-1335d9b7b3a3?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Razer BlackWidow Keyboard', 'Mechanical keyboard with RGB', 'Peripherals', 45000.00, 9, 'PERI-RAZER-BW', 'https://images.unsplash.com/photo-1582201961738-3d6d9b3b2f5b?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('HyperX Cloud II Headset', 'Comfortable wired gaming headset', 'Peripherals', 30000.00, 20, 'HEAD-HYPERX-CLOUD2', 'https://images.unsplash.com/photo-1516728778615-2d590ea1856f?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('AOC 27-inch 144Hz Monitor', 'Smooth 144Hz gaming monitor', 'Monitor', 130000.00, 8, 'MON-AOC-27-144HZ', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Samsung T7 Portable SSD 1TB', 'Portable high-speed SSD', 'Storage', 45000.00, 19, 'EXT-SSD-SAMSUNG-T7-1TB', 'https://images.unsplash.com/photo-1530018607918-5c3f9bfcb1b8?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Anker USB-C Dock', 'USB-C docking station for laptops', 'Accessories', 20000.00, 16, 'ACC-ANKER-DOCK', 'https://images.unsplash.com/photo-1545231028-1335d9b7b3a3?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('TP-Link Powerline Adapter', 'Ethernet over power adapters for better home networking', 'Networking', 15000.00, 22, 'NET-TP-POWERLINE', 'https://images.unsplash.com/photo-1545231028-1335d9b7b3a3?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Elgato Stream Deck Mini', 'Stream control pad for creators', 'Peripherals', 35000.00, 10, 'PERI-ELGATO-MINI', 'https://images.unsplash.com/photo-1545231028-1335d9b7b3a3?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('WD Red NAS 4TB', 'NAS-optimized HDD for small offices', 'Storage', 55000.00, 6, 'HDD-WD-RED-4TB', 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Microsoft Wireless Display Adapter', 'Cast your screen wirelessly to displays', 'Accessories', 12000.00, 28, 'ACC-MS-WDA', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Philips Monitor Arm', 'Ergonomic monitor mount', 'Accessories', 18000.00, 12, 'ACC-PHIL-MON-ARM', 'https://images.unsplash.com/photo-1545231028-1335d9b7b3a3?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Brother HL-L2350DW Printer', 'Reliable monochrome laser printer for small offices', 'Peripherals', 45000.00, 7, 'PERI-BRO-HL2350', 'https://images.unsplash.com/photo-1545231028-1335d9b7b3a3?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Apple Magic Keyboard', 'Compact wireless keyboard for Mac users', 'Peripherals', 40000.00, 8, 'PERI-APPLE-MAG-KEY', 'https://images.unsplash.com/photo-1545231028-1335d9b7b3a3?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('LG Ultrawide Monitor 34-inch', 'Immersive ultrawide display for productivity', 'Monitor', 320000.00, 3, 'MON-LG-34-ULTRA', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('ADATA SU800 512GB SSD', 'Affordable SSD option for upgrades', 'Storage', 30000.00, 20, 'SSD-ADATA-512-G', 'https://images.unsplash.com/photo-1587202372775-1f1b8a6f9c6b?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('TP-Link Mesh WiFi Kit', 'Whole-home mesh WiFi solution', 'Networking', 80000.00, 9, 'NET-TP-MESH-KIT', 'https://images.unsplash.com/photo-1545231028-1335d9b7b3a3?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Samsung Odyssey G7 Monitor', 'High-refresh gaming monitor with curvature', 'Monitor', 420000.00, 2, 'MON-SAM-G7', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Razer Viper Mouse', 'Lightweight gaming mouse', 'Peripherals', 22000.00, 24, 'PERI-RAZER-VIPER', 'https://images.unsplash.com/photo-1545231028-1335d9b7b3a3?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Seagate IronWolf 8TB NAS', 'Large capacity NAS drive for backups', 'Storage', 140000.00, 4, 'HDD-SEAGATE-IRONWOLF-8TB', 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Sony WH-1000XM4', 'Noise cancelling headphones', 'Peripherals', 120000.00, 10, 'HEAD-SONY-WH1000XM4', 'https://images.unsplash.com/photo-1516728778615-2d590ea1856f?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true),
('Elgato Cam Link 4K', 'Capture HDMI camera input to PC', 'Peripherals', 60000.00, 6, 'PERI-ELGATO-CAM-LINK', 'https://images.unsplash.com/photo-1545231028-1335d9b7b3a3?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.1.0', true)
ON CONFLICT (sku) DO UPDATE
  SET name = EXCLUDED.name,
      description = EXCLUDED.description,
      category = EXCLUDED.category,
      price = EXCLUDED.price,
      stock_quantity = EXCLUDED.stock_quantity,
      image_url = EXCLUDED.image_url,
      is_active = EXCLUDED.is_active,
      updated_at = NOW();

-- Additional blog posts (5 items) to bring total to ~20 posts
INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, status, published_at)
VALUES
('Building a Reliable Backup Strategy for Small Businesses', 'backup-strategy-small-businesses',
 'We discuss affordable backup strategies including local NAS and cloud integration appropriate for small Nigerian businesses.',
 'Learn how to build a reliable backup strategy for your small business.',
 'https://source.unsplash.com/featured/?backup,server', 'published', NOW() - INTERVAL '3 days'),

('Troubleshooting Slow Internet in Your Home', 'troubleshoot-slow-internet',
 'A practical guide to diagnosing and fixing slow home internet issues.',
 'Fix slow home internet with our troubleshooting tips.',
 'https://source.unsplash.com/featured/?internet,slow', 'published', NOW() - INTERVAL '4 days'),

('Cloud Storage Options for Nigerian Businesses', 'cloud-storage-options-nigeria',
 'Comparing local and international cloud providers, costs, and compliance tips.',
 'Find the best cloud storage options for your business needs.',
 'https://source.unsplash.com/featured/?cloud-storage,cloud', 'published', NOW() - INTERVAL '2 days'),

('Optimizing Your Gaming PC for Better FPS', 'optimize-gaming-pc-fps',
 'Tuning settings, GPU drivers, and hardware upgrades to improve FPS.',
 'Boost your FPS with practical optimization tips.',
 'https://source.unsplash.com/featured/?gaming-pc,optimize', 'published', NOW() - INTERVAL '5 days'),

('Remote Work Setup: Essentials for Nigerian Freelancers', 'remote-work-essentials-nigeria',
 'Key hardware and software to stay productive while working remotely in Nigerian cities.',
 'Essential setup tips for remote freelancers.',
 'https://source.unsplash.com/featured/?remote-work,home-office', 'published', NOW() - INTERVAL '1 day')
ON CONFLICT (slug) DO UPDATE
  SET title = EXCLUDED.title,
      content = EXCLUDED.content,
      excerpt = EXCLUDED.excerpt,
      featured_image = EXCLUDED.featured_image,
      status = EXCLUDED.status,
      published_at = EXCLUDED.published_at,
      updated_at = NOW();
