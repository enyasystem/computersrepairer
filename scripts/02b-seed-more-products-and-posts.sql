-- Additional products (35 items) to bring total to ~50 products
INSERT INTO products (name, description, category, price, stock_quantity, sku, image_url, is_active)
VALUES
('AMD Ryzen 7 5800X', 'High-performance CPU for gaming and content creation', 'CPU', 200000.00, 12, 'CPU-AMD-R7-5800X', 'https://picsum.photos/seed/CPU-AMD-R7-5800X/1200/800', true),
('Intel Core i5-12400', 'Balanced CPU for general productivity and light gaming', 'CPU', 120000.00, 20, 'CPU-INTEL-I5-12400', 'https://placehold.co/1200x800/eeeeee/000000?text=CPU-INTEL-I5-12400', true),
('ASUS ROG Strix Motherboard', 'Gaming motherboard with robust power delivery', 'Motherboard', 150000.00, 7, 'MB-ASUS-ROG-STRIX', 'https://via.placeholder.com/1200x800.png?text=MB-ASUS-ROG-STRIX', true),
('G.SKILL Trident Z 32GB', 'High-speed DDR4 RAM kit (2x16GB)', 'Memory', 85000.00, 15, 'RAM-GSKILL-32GB', 'https://dummyimage.com/1200x800/cccccc/000000.png&text=RAM-GSKILL-32GB', true),
('Samsung 980 Pro 2TB', 'High-end NVMe SSD for fast storage', 'Storage', 200000.00, 6, 'SSD-SAMSUNG-980-2TB', 'https://loremflickr.com/1200/800/nvme', true),
('Crucial MX500 1TB', 'Reliable SATA SSD for everyday use', 'Storage', 65000.00, 18, 'SSD-CRUCIAL-MX500-1TB', 'https://picsum.photos/seed/SSD-CRUCIAL-MX500-1TB/1200/800', true),
('MSI Gaming GPU RTX 3070', 'Powerful GPU for 1440p gaming', 'Graphics', 350000.00, 5, 'GPU-MSI-RTX3070', 'https://placehold.co/1200x800/eeeeee/000000?text=GPU-MSI-RTX3070', true),
('ASRock B550 Motherboard', 'Affordable AM4 motherboard', 'Motherboard', 45000.00, 10, 'MB-ASROCK-B550', 'https://via.placeholder.com/1200x800.png?text=MB-ASROCK-B550', true),
('Be Quiet! Pure Rock 2', 'Efficient CPU air cooler', 'Cooling', 25000.00, 20, 'COOL-BQ-PURE-ROCK-2', 'https://dummyimage.com/1200x800/cccccc/000000.png&text=COOL-BQ-PURE-ROCK-2', true),
('Corsair LL120 RGB Fan (3-pack)', 'RGB cooling fans for cases', 'Cooling', 18000.00, 25, 'FAN-CORSAIR-LL120-3PK', 'https://loremflickr.com/1200/800/rgb-fan', true),
('NZXT H510 Case', 'Sleek mid-tower case with good airflow', 'Case', 60000.00, 11, 'CASE-NZXT-H510', 'https://picsum.photos/seed/CASE-NZXT-H510/1200/800', true),
('Seasonic S12III 650W PSU', 'Efficient power supply with solid build', 'Power', 40000.00, 14, 'PSU-SEASONIC-650W', 'https://placehold.co/1200x800/eeeeee/000000?text=PSU-SEASONIC-650W', true),
('Logitech C920 Webcam', '1080p webcam for meetings and streaming', 'Peripherals', 25000.00, 30, 'CAM-LOGI-C920', 'https://via.placeholder.com/1200x800.png?text=CAM-LOGI-C920', true),
('Razer BlackWidow Keyboard', 'Mechanical keyboard with RGB', 'Peripherals', 45000.00, 9, 'PERI-RAZER-BW', 'https://dummyimage.com/1200x800/cccccc/000000.png&text=PERI-RAZER-BW', true),
('HyperX Cloud II Headset', 'Comfortable wired gaming headset', 'Peripherals', 30000.00, 20, 'HEAD-HYPERX-CLOUD2', 'https://loremflickr.com/1200/800/gaming-headset', true),
('AOC 27-inch 144Hz Monitor', 'Smooth 144Hz gaming monitor', 'Monitor', 130000.00, 8, 'MON-AOC-27-144HZ', 'https://picsum.photos/seed/MON-AOC-27-144HZ/1200/800', true),
('Samsung T7 Portable SSD 1TB', 'Portable high-speed SSD', 'Storage', 45000.00, 19, 'EXT-SSD-SAMSUNG-T7-1TB', 'https://placehold.co/1200x800/eeeeee/000000?text=EXT-SSD-SAMSUNG-T7-1TB', true),
('Anker USB-C Dock', 'USB-C docking station for laptops', 'Accessories', 20000.00, 16, 'ACC-ANKER-DOCK', 'https://via.placeholder.com/1200x800.png?text=ACC-ANKER-DOCK', true),
('TP-Link Powerline Adapter', 'Ethernet over power adapters for better home networking', 'Networking', 15000.00, 22, 'NET-TP-POWERLINE', 'https://dummyimage.com/1200x800/cccccc/000000.png&text=NET-TP-POWERLINE', true),
('Elgato Stream Deck Mini', 'Stream control pad for creators', 'Peripherals', 35000.00, 10, 'PERI-ELGATO-MINI', 'https://loremflickr.com/1200/800/stream-deck', true),
('WD Red NAS 4TB', 'NAS-optimized HDD for small offices', 'Storage', 55000.00, 6, 'HDD-WD-RED-4TB', 'https://picsum.photos/seed/HDD-WD-RED-4TB/1200/800', true),
('Microsoft Wireless Display Adapter', 'Cast your screen wirelessly to displays', 'Accessories', 12000.00, 28, 'ACC-MS-WDA', 'https://placehold.co/1200x800/eeeeee/000000?text=ACC-MS-WDA', true),
('Philips Monitor Arm', 'Ergonomic monitor mount', 'Accessories', 18000.00, 12, 'ACC-PHIL-MON-ARM', 'https://via.placeholder.com/1200x800.png?text=ACC-PHIL-MON-ARM', true),
('Brother HL-L2350DW Printer', 'Reliable monochrome laser printer for small offices', 'Peripherals', 45000.00, 7, 'PERI-BRO-HL2350', 'https://dummyimage.com/1200x800/cccccc/000000.png&text=PERI-BRO-HL2350', true),
('Apple Magic Keyboard', 'Compact wireless keyboard for Mac users', 'Peripherals', 40000.00, 8, 'PERI-APPLE-MAG-KEY', 'https://loremflickr.com/1200/800/apple-keyboard', true),
('LG Ultrawide Monitor 34-inch', 'Immersive ultrawide display for productivity', 'Monitor', 320000.00, 3, 'MON-LG-34-ULTRA', 'https://picsum.photos/seed/MON-LG-34-ULTRA/1200/800', true),
('ADATA SU800 512GB SSD', 'Affordable SSD option for upgrades', 'Storage', 30000.00, 20, 'SSD-ADATA-512-G', 'https://placehold.co/1200x800/eeeeee/000000?text=SSD-ADATA-512-G', true),
('TP-Link Mesh WiFi Kit', 'Whole-home mesh WiFi solution', 'Networking', 80000.00, 9, 'NET-TP-MESH-KIT', 'https://via.placeholder.com/1200x800.png?text=NET-TP-MESH-KIT', true),
('Samsung Odyssey G7 Monitor', 'High-refresh gaming monitor with curvature', 'Monitor', 420000.00, 2, 'MON-SAM-G7', 'https://dummyimage.com/1200x800/cccccc/000000.png&text=MON-SAM-G7', true),
('Razer Viper Mouse', 'Lightweight gaming mouse', 'Peripherals', 22000.00, 24, 'PERI-RAZER-VIPER', 'https://loremflickr.com/1200/800/gaming-mouse', true),
('Seagate IronWolf 8TB NAS', 'Large capacity NAS drive for backups', 'Storage', 140000.00, 4, 'HDD-SEAGATE-IRONWOLF-8TB', 'https://picsum.photos/seed/HDD-SEAGATE-IRONWOLF-8TB/1200/800', true),
('Sony WH-1000XM4', 'Noise cancelling headphones', 'Peripherals', 120000.00, 10, 'HEAD-SONY-WH1000XM4', 'https://placehold.co/1200x800/eeeeee/000000?text=HEAD-SONY-WH1000XM4', true),
('Elgato Cam Link 4K', 'Capture HDMI camera input to PC', 'Peripherals', 60000.00, 6, 'PERI-ELGATO-CAM-LINK', 'https://via.placeholder.com/1200x800.png?text=PERI-ELGATO-CAM-LINK', true)
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
