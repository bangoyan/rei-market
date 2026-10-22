-- ==============================================================================
-- REI MARKET - KEAMANAN DEMO ADMIN & PROTEKSI DATA (RLS)
-- ==============================================================================
-- Jalankan script ini di Supabase SQL Editor.
-- Script ini memastikan akun demo admin hanya bisa MELIHAT (read-only),
-- sedangkan perubahan/penghapusan data hanya bisa dilakukan oleh Owner.
-- ==============================================================================

-- 1. Ganti 'PASTE_YOUR_OWNER_USER_ID_HERE' dengan UUID akun Supabase Anda.
--    UUID bisa dicek di Supabase Dashboard -> Authentication -> Users.
create or replace function is_owner()
returns boolean as $$
  -- Masukkan UUID Anda di bawah ini:
  select auth.uid() = 'cf6b30e4-26d6-4d1b-aaf1-2e8e22280d18'::uuid;
$$ language sql stable security definer;

-- 2. Update Kebijakan Produk (Products)
--    Admin demo bisa melihat semua produk (termasuk non-aktif),
--    hanya Owner yang bisa tambah, ubah, dan hapus.
drop policy if exists "Admins manage products" on products;

create policy "Admins read all products" on products
  for select to authenticated
  using (is_admin());

create policy "Owner insert products" on products
  for insert to authenticated
  with check (is_owner());

create policy "Owner update products" on products
  for update to authenticated
  using (is_owner());

create policy "Owner delete products" on products
  for delete to authenticated
  using (is_owner());

-- 3. Update Kebijakan Kategori (Categories)
drop policy if exists "Admins manage categories" on categories;

create policy "Owner manage categories" on categories
  for all to authenticated
  using (is_owner());

-- 4. Update Kebijakan Pesanan (Orders)
--    Admin demo bisa melihat semua pesanan, hanya Owner yang bisa ubah status/hapus.
drop policy if exists "Admins manage orders" on orders;

create policy "Admins read all orders" on orders
  for select to authenticated
  using (is_admin());

create policy "Owner manage orders" on orders
  for update to authenticated
  using (is_owner());

-- 5. Update Kebijakan Order Items
drop policy if exists "Admins manage order items" on order_items;

create policy "Admins read all order items" on order_items
  for select to authenticated
  using (is_admin());

create policy "Owner manage order items" on order_items
  for all to authenticated
  using (is_owner());

-- 6. Update Kebijakan Pengguna (Profiles)
--    Hanya Owner yang bisa mengubah role user lain.
create policy "Owner update any profile" on profiles
  for update to authenticated
  using (is_owner());

-- ==============================================================================
-- CARA MEMBUAT AKUN DEMO ADMIN:
-- 1. Daftar akun baru di website Anda: misal admin.demo@reimarket.com
-- 2. Di Supabase SQL Editor, jadikan akun tersebut admin:
--    UPDATE profiles SET role = 'admin' WHERE email = 'admin.demo@reimarket.com';
-- ==============================================================================
