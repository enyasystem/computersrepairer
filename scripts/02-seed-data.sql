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

-- Insert sample products
INSERT INTO products (name, description, category, price, stock_quantity, sku) VALUES
('RAM 16GB DDR4', 'High-performance 16GB DDR4 memory module', 'Memory', 89.99, 25, 'RAM-DDR4-16GB'),
('SSD 1TB NVMe', 'Fast 1TB NVMe solid state drive', 'Storage', 129.99, 15, 'SSD-NVME-1TB'),
('Graphics Card GTX 1660', 'NVIDIA GTX 1660 graphics card', 'Graphics', 299.99, 8, 'GPU-GTX1660'),
('Power Supply 650W', '80+ Gold certified 650W power supply', 'Power', 79.99, 12, 'PSU-650W-GOLD'),
('Motherboard B450', 'AMD B450 chipset motherboard', 'Motherboard', 119.99, 6, 'MB-B450-AMD');

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, status, published_at) VALUES
('5 Signs Your Computer Needs Professional Repair', '5-signs-computer-needs-repair', 
'Your computer is an essential tool for work and entertainment, but like any machine, it can develop problems over time. Here are five clear signs that indicate your computer needs professional attention...', 
'Learn the warning signs that indicate your computer needs professional repair services.',
'published', NOW() - INTERVAL '7 days'),

('How to Extend Your Laptop Battery Life', 'extend-laptop-battery-life',
'Laptop batteries naturally degrade over time, but there are several strategies you can use to maximize their lifespan and performance. In this guide, we''ll cover the best practices for battery care...', 
'Discover proven methods to extend your laptop battery life and improve performance.',
'published', NOW() - INTERVAL '14 days'),

('The Importance of Regular Computer Maintenance', 'regular-computer-maintenance',
'Just like your car needs regular oil changes, your computer needs regular maintenance to run smoothly. Preventive maintenance can save you money and extend your computer''s lifespan...', 
'Why regular computer maintenance is crucial for optimal performance and longevity.',
'published', NOW() - INTERVAL '21 days');

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
