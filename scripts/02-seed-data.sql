-- Insert sample customers
INSERT INTO customers (name, email, phone, address) VALUES
('John Smith', 'john.smith@email.com', '(555) 123-4567', '123 Main St, Anytown, ST 12345'),
('Sarah Johnson', 'sarah.j@email.com', '(555) 234-5678', '456 Oak Ave, Somewhere, ST 67890'),
('Mike Wilson', 'mike.wilson@email.com', '(555) 345-6789', '789 Pine Rd, Elsewhere, ST 54321'),
('Emily Davis', 'emily.davis@email.com', '(555) 456-7890', '321 Elm St, Nowhere, ST 98765')
ON CONFLICT (email) DO NOTHING;

-- Insert sample repair requests
INSERT INTO repair_requests (customer_id, device_type, device_model, issue_description, status, priority, estimated_cost) VALUES
(1, 'Laptop', 'Dell XPS 13', 'Screen flickering and random shutdowns', 'in_progress', 'high', 250.00),
(2, 'Desktop', 'Custom Build', 'Computer won''t boot, possible motherboard issue', 'pending', 'medium', 180.00),
(3, 'Phone', 'iPhone 12', 'Cracked screen replacement needed', 'completed', 'low', 120.00),
(4, 'Tablet', 'iPad Air', 'Battery drains very quickly', 'pending', 'medium', 90.00);

-- Upsert sample products (15 items) with images from Unsplash (Nigeria-focused descriptions)
INSERT INTO products (name, description, category, price, stock_quantity, sku, image_url, is_active)
VALUES
('Corsair Vengeance RAM 16GB', '16GB DDR4 memory module — popular in Lagos gaming cafes and repair shops', 'Memory', 45000.00, 30, 'RAM-CORSAIR-16GB', 'https://source.unsplash.com/featured/?ram,computer,lagos', true),
('Samsung 970 EVO Plus 1TB', '1TB NVMe SSD — fast storage for Nigerian small businesses and creatives', 'Storage', 85000.00, 20, 'SSD-SAMSUNG-1TB', 'https://source.unsplash.com/featured/?ssd,storage,nigeria', true),
('NVIDIA RTX 3060', 'Graphics card for gaming and content creation in Lagos setups', 'Graphics', 280000.00, 10, 'GPU-RTX3060', 'https://source.unsplash.com/featured/?graphics-card,gpu,lagos', true),
('Seagate Barracuda 2TB HDD', '2TB HDD for backups and media storage in Nigerian offices', 'Storage', 40000.00, 40, 'HDD-SEAGATE-2TB', 'https://source.unsplash.com/featured/?hard-drive,storage,nigeria', true),
('Corsair 650W PSU', 'Reliable 650W power supply for desktop builds in Abuja and Lagos', 'Power', 55000.00, 18, 'PSU-CORSAIR-650W', 'https://source.unsplash.com/featured/?power-supply,pc,nigeria', true),
('ASUS TUF B450 Motherboard', 'Durable AMD B450 motherboard — common in Nigerian budget builds', 'Motherboard', 60000.00, 8, 'MB-ASUS-B450', 'https://source.unsplash.com/featured/?motherboard,pc,nigeria', true),
('Kingston A2000 500GB NVMe', '500GB NVMe SSD — affordable choice for local businesses', 'Storage', 42000.00, 25, 'SSD-KINGSTON-500GB', 'https://source.unsplash.com/featured/?nvme,ssd,nigeria', true),
('Logitech MK270 Keyboard + Mouse', 'Wireless keyboard and mouse combo used widely in Nigerian offices', 'Peripherals', 15000.00, 50, 'PERI-LOGITECH-MK270', 'https://source.unsplash.com/featured/?keyboard,mouse,nigeria', true),
('Dell 24-inch Monitor', '24" Full HD monitor — widely used in Lagos home offices', 'Monitor', 70000.00, 12, 'MON-DEL-24', 'https://source.unsplash.com/featured/?monitor,display,lagos', true),
('WD My Passport 1TB', 'Portable 1TB drive for backups and transfers across Nigerian cities', 'Storage', 32000.00, 22, 'EXT-WD-1TB', 'https://source.unsplash.com/featured/?external-hard-drive,backup,nigeria', true),
('TP-Link Archer AX10 Router', 'WiFi router suitable for small Lagos businesses and remote work', 'Networking', 38000.00, 15, 'ROUTER-TPAX10', 'https://source.unsplash.com/featured/?router,wifi,nigeria', true),
('SanDisk Ultra 128GB MicroSD', '128GB MicroSD for cameras and mobile devices popular in Nigeria', 'Storage', 8000.00, 80, 'SD-SANDISK-128GB', 'https://source.unsplash.com/featured/?micro-sd,storage,nigeria', true),
('Cooler Master H500 Case', 'High-airflow ATX case commonly used by PC builders in Nigeria', 'Case', 90000.00, 9, 'CASE-CM-H500', 'https://source.unsplash.com/featured/?pc-case,computer,nigeria', true),
('Noctua NH-U12S Cooler', 'Quiet CPU cooler for reliable temperatures in hot climates', 'Cooling', 45000.00, 14, 'COOL-NOCTUA-U12S', 'https://source.unsplash.com/featured/?cpu-cooler,fan,nigeria', true),
('Microsoft Surface Pro Charger', 'Charger compatible with Surface Pro devices — replacement available locally', 'Accessories', 20000.00, 35, 'ACC-SURFACE-CHG', 'https://source.unsplash.com/featured/?charger,laptop,nigeria', true)
ON CONFLICT (sku) DO UPDATE
	SET name = EXCLUDED.name,
			description = EXCLUDED.description,
			category = EXCLUDED.category,
	price = EXCLUDED.price,
			stock_quantity = EXCLUDED.stock_quantity,
			image_url = EXCLUDED.image_url,
			is_active = EXCLUDED.is_active,
			updated_at = NOW();

-- Upsert sample blog posts (15 Nigeria-focused posts) with Unsplash images
INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, status, published_at)
VALUES
('5 Signs Your Computer Needs Professional Repair', '5-signs-computer-needs-repair',
 'Your computer is an essential tool for work and entertainment. Here are five clear signs that indicate your computer needs professional attention, with advice tailored for users in Lagos and Abuja...',
 'Learn the warning signs that indicate your computer needs professional repair services.',
 'https://source.unsplash.com/featured/?computer-repair,technician,nigeria', 'published', NOW() - INTERVAL '7 days'),

('How to Extend Your Laptop Battery Life', 'extend-laptop-battery-life',
 'Laptop batteries naturally degrade. This guide provides practical tips to extend battery life for users in hot climates like Lagos.',
 'Discover proven methods to extend your laptop battery life and improve performance.',
 'https://source.unsplash.com/featured/?laptop,battery,nigeria', 'published', NOW() - INTERVAL '14 days'),

('The Importance of Regular Computer Maintenance', 'regular-computer-maintenance',
 'Regular maintenance prevents downtime — here''s a checklist for small businesses in Nigeria.',
 'Why regular computer maintenance is crucial for optimal performance and longevity.',
 'https://source.unsplash.com/featured/?maintenance,computer,nigeria', 'published', NOW() - INTERVAL '21 days'),

('Setting Up Secure WiFi for Your Lagos Small Business', 'secure-wifi-lagos',
 'Step-by-step setup for secure WiFi networks, including affordable router options available locally.',
 'Secure your small business network with practical steps and recommended equipment.',
 'https://source.unsplash.com/featured/?wifi,router', 'published', NOW() - INTERVAL '10 days'),

('Choosing the Right SSD for Nigerian Startups', 'ssd-for-nigerian-startups',
 'Comparison of NVMe and SATA options, cost vs performance for local businesses.',
 'Pick the best SSD for performance and budget.',
 'https://source.unsplash.com/featured/?ssd,storage', 'published', NOW() - INTERVAL '12 days'),

('Protecting Your Data: Backup Strategies in Nigeria', 'backup-strategies-nigeria',
 'Local options for offsite and cloud backups, including recommended services and schedules.',
 'Practical backup strategies to protect your business data.',
 'https://source.unsplash.com/featured/?backup,cloud', 'published', NOW() - INTERVAL '18 days'),

('Affordable PC Builds for Students in Abuja', 'pc-builds-students-abuja',
 'Build suggestions and parts lists for budget-conscious students.',
 'Affordable PC builds and parts recommendations.',
 'https://source.unsplash.com/featured/?pc-build,students', 'published', NOW() - INTERVAL '16 days'),

('How to Speed Up Older Laptops', 'speed-up-older-laptops',
 'Simple upgrades and optimizations to keep older machines usable longer.',
 'Upgrade tips to speed up aging laptops.',
 'https://source.unsplash.com/featured/?laptop,upgrade', 'published', NOW() - INTERVAL '20 days'),

('Localizing Software: Best Practices for Nigerian Businesses', 'localize-software-nigeria',
 'Guidance on localization, language support, and payment integrations for Nigerian users.',
 'Best practices for localizing software products.',
 'https://source.unsplash.com/featured/?software,development', 'published', NOW() - INTERVAL '22 days'),

('Network Troubleshooting Tips for Home Offices', 'network-troubleshooting-home',
 'Quick diagnostic steps for common home network issues.',
 'Troubleshoot common home network problems with this checklist.',
 'https://source.unsplash.com/featured/?network,troubleshoot', 'published', NOW() - INTERVAL '8 days'),

('Choosing the Right Antivirus for Small Businesses', 'antivirus-small-business',
 'Review of recommended antivirus solutions that balance cost and protection.',
 'Find the right antivirus for your business needs.',
 'https://source.unsplash.com/featured/?antivirus,security', 'published', NOW() - INTERVAL '9 days'),

('Data Recovery: When to Call a Professional in Nigeria', 'data-recovery-nigeria',
 'Signs that mean your data needs professional recovery and what to expect.',
 'Understand when professional data recovery is necessary and the process.',
 'https://source.unsplash.com/featured/?data-recovery,hard-drive', 'published', NOW() - INTERVAL '6 days'),

('Optimizing Small Office Networks in Lagos', 'optimize-office-networks-lagos',
 'Tips for improving throughput, reliability, and security in small Lagos offices.',
 'Network optimization tips for small offices.',
 'https://source.unsplash.com/featured/?office,network', 'published', NOW() - INTERVAL '11 days'),

('Guide to Buying Refurbished Laptops in Nigeria', 'buy-refurbished-laptops-nigeria',
 'How to inspect and choose a reliable refurbished laptop.',
 'Practical advice for buying refurbished laptops locally.',
 'https://source.unsplash.com/featured/?refurbished,laptop', 'published', NOW() - INTERVAL '13 days'),

('Future-Proofing Your Home Office Setup', 'future-proof-home-office',
 'Hardware and layout recommendations to help your home office scale with needs.',
 'Make your home office ready for future demands.',
 'https://source.unsplash.com/featured/?home-office,setup', 'published', NOW() - INTERVAL '5 days')
ON CONFLICT (slug) DO UPDATE
	SET title = EXCLUDED.title,
			content = EXCLUDED.content,
			excerpt = EXCLUDED.excerpt,
			featured_image = EXCLUDED.featured_image,
			status = EXCLUDED.status,
			published_at = EXCLUDED.published_at,
			updated_at = NOW();

-- Insert sample inquiries
INSERT INTO inquiries (name, email, phone, subject, message, status) VALUES
('Robert Brown', 'robert.b@email.com', '(555) 567-8901', 'Data Recovery Service', 'I accidentally deleted important files from my external hard drive. Can you help recover them?', 'new'),
('Lisa Garcia', 'lisa.garcia@email.com', '(555) 678-9012', 'Virus Removal', 'My computer is running very slowly and I think it might have a virus. What are your rates for virus removal?', 'in_progress'),
('David Lee', 'david.lee@email.com', '(555) 789-0123', 'Custom PC Build', 'I''m interested in having a custom gaming PC built. Can you provide a quote?', 'resolved');

-- Insert sample repair notes
INSERT INTO repair_notes (repair_request_id, note, created_by) VALUES
(1, 'Initial diagnosis completed. Screen replacement required and thermal paste needs renewal.', 'Tech Support'),
(1, 'Ordered replacement screen. ETA 2-3 business days.', 'Admin'),
(3, 'Screen replacement completed successfully. Device tested and ready for pickup.', 'Tech Support');
