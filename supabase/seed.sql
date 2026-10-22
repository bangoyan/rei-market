-- Seed data for Rei Market (Idempotent - safe to run multiple times)

-- Categories
INSERT INTO categories (id, name, slug, image_url) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Fresh Produce', 'fresh-produce', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop'),
  ('c1000000-0000-0000-0000-000000000002', 'Dairy & Eggs', 'dairy-eggs', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop'),
  ('c1000000-0000-0000-0000-000000000003', 'Bakery', 'bakery', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop'),
  ('c1000000-0000-0000-0000-000000000004', 'Beverages', 'beverages', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop'),
  ('c1000000-0000-0000-0000-000000000005', 'Snacks', 'snacks', 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop'),
  ('c1000000-0000-0000-0000-000000000006', 'Pantry Staples', 'pantry-staples', 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=400&h=400&fit=crop')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  image_url = EXCLUDED.image_url;

-- Products
INSERT INTO products (name, slug, description, price, stock, category_id, images, is_active) VALUES
  ('Red Apple (1 kg)', 'red-apple-1kg', 'Fresh red apples, crispy and sweet. Sourced from Malang highlands.', 35000, 50, 'c1000000-0000-0000-0000-000000000001', '{"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop"}', true),
  ('Banana Cavendish (1 bunch)', 'banana-cavendish', 'Sweet Cavendish bananas, perfectly ripe.', 25000, 40, 'c1000000-0000-0000-0000-000000000001', '{"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=600&fit=crop"}', true),
  ('Broccoli (500g)', 'broccoli-500g', 'Fresh organic broccoli from local farms.', 18000, 30, 'c1000000-0000-0000-0000-000000000001', '{"https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&h=600&fit=crop"}', true),
  ('Carrot (500g)', 'carrot-500g', 'Crunchy fresh carrots, great for salads and cooking.', 12000, 45, 'c1000000-0000-0000-0000-000000000001', '{"https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&h=600&fit=crop"}', true),
  ('Full Cream Milk (1L)', 'full-cream-milk-1l', 'Fresh pasteurized full cream milk.', 18500, 60, 'c1000000-0000-0000-0000-000000000002', '{"https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=600&fit=crop"}', true),
  ('Free Range Eggs (10 pcs)', 'free-range-eggs-10', 'Farm-fresh free range eggs, high protein.', 32000, 35, 'c1000000-0000-0000-0000-000000000002', '{"https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=600&fit=crop"}', true),
  ('Greek Yogurt (200g)', 'greek-yogurt-200g', 'Thick and creamy plain Greek yogurt.', 24000, 25, 'c1000000-0000-0000-0000-000000000002', '{"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=600&fit=crop"}', true),
  ('Sourdough Bread', 'sourdough-bread', 'Artisan sourdough bread, baked fresh daily.', 45000, 15, 'c1000000-0000-0000-0000-000000000003', '{"https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=600&fit=crop"}', true),
  ('Croissant (2 pcs)', 'croissant-2pcs', 'Buttery flaky croissants, perfect for breakfast.', 28000, 20, 'c1000000-0000-0000-0000-000000000003', '{"https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&h=600&fit=crop"}', true),
  ('Orange Juice (1L)', 'orange-juice-1l', 'Pure squeezed orange juice, no added sugar.', 32000, 40, 'c1000000-0000-0000-0000-000000000004', '{"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&h=600&fit=crop"}', true),
  ('Mineral Water (600ml)', 'mineral-water-600ml', 'Natural mineral water from mountain springs.', 5000, 200, 'c1000000-0000-0000-0000-000000000004', '{"https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=600&fit=crop"}', true),
  ('Green Tea (25 bags)', 'green-tea-25bags', 'Premium Japanese green tea bags.', 28000, 50, 'c1000000-0000-0000-0000-000000000004', '{"https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&h=600&fit=crop"}', true),
  ('Mixed Nuts (200g)', 'mixed-nuts-200g', 'Roasted almonds, cashews, and macadamia blend.', 55000, 30, 'c1000000-0000-0000-0000-000000000005', '{"https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&h=600&fit=crop"}', true),
  ('Dark Chocolate Bar (100g)', 'dark-chocolate-100g', '72% cacao dark chocolate, smooth and rich.', 38000, 25, 'c1000000-0000-0000-0000-000000000005', '{"https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&h=600&fit=crop"}', true),
  ('Extra Virgin Olive Oil (500ml)', 'olive-oil-500ml', 'Cold-pressed extra virgin olive oil from Mediterranean.', 95000, 20, 'c1000000-0000-0000-0000-000000000006', '{"https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&h=600&fit=crop"}', true),
  ('Jasmine Rice (5 kg)', 'jasmine-rice-5kg', 'Premium Thai jasmine rice, fragrant and fluffy.', 75000, 40, 'c1000000-0000-0000-0000-000000000006', '{"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"}', true),
  ('Sea Salt (250g)', 'sea-salt-250g', 'Natural sea salt, harvested from coastal regions.', 15000, 60, 'c1000000-0000-0000-0000-000000000006', '{"https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600&h=600&fit=crop"}', true),
  ('Organic Honey (300ml)', 'organic-honey-300ml', 'Raw organic honey from forest beekeepers.', 68000, 15, 'c1000000-0000-0000-0000-000000000006', '{"https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop"}', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  category_id = EXCLUDED.category_id,
  images = EXCLUDED.images,
  is_active = EXCLUDED.is_active;
