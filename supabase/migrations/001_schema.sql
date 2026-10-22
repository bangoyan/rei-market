-- Rei Market Schema

-- Profiles (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  phone text,
  address text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
exception when others then
  raise log 'handle_new_user error: %', sqlerrm;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Categories
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  image_url text
);

-- Products
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  price bigint not null, -- stored in smallest unit (Rupiah)
  stock integer not null default 0,
  category_id uuid references categories on delete set null,
  images text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Cart items
create table cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references products on delete cascade not null,
  quantity integer not null default 1 check (quantity > 0),
  unique (user_id, product_id)
);

-- Wishlist
create table wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references products on delete cascade not null,
  unique (user_id, product_id)
);

-- Orders
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total bigint not null,
  shipping_address text not null,
  created_at timestamptz not null default now()
);

-- Order items
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders on delete cascade not null,
  product_id uuid references products on delete cascade not null,
  quantity integer not null,
  price_at_purchase bigint not null
);

-- Reviews
create table reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references products on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- Indexes
create index idx_products_category on products (category_id);
create index idx_products_active on products (is_active) where is_active = true;
create index idx_cart_user on cart_items (user_id);
create index idx_wishlist_user on wishlist (user_id);
create index idx_orders_user on orders (user_id);
create index idx_order_items_order on order_items (order_id);
create index idx_reviews_product on reviews (product_id);

-- RLS
alter table profiles enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table cart_items enable row level security;
alter table wishlist enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table reviews enable row level security;

-- Helper function to check admin role without querying profiles (avoids RLS recursion)
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Profiles: users read/insert/update own, admins read all
create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Users insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins read all profiles" on profiles for select using (is_admin());

-- Categories: public read
create policy "Public read categories" on categories for select to anon, authenticated using (true);
create policy "Admins manage categories" on categories for all using (is_admin());

-- Products: public read active
create policy "Public read active products" on products for select to anon, authenticated using (is_active = true);
create policy "Admins manage products" on products for all using (is_admin());

-- Cart: own items only
create policy "Users manage own cart" on cart_items for all using (auth.uid() = user_id);

-- Wishlist: own items only
create policy "Users manage own wishlist" on wishlist for all using (auth.uid() = user_id);

-- Orders: own orders, admins see all
create policy "Users read own orders" on orders for select using (auth.uid() = user_id);
create policy "Users create orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admins manage orders" on orders for all using (is_admin());

-- Order items: readable if user owns the order
create policy "Users read own order items" on order_items for select using (
  exists (select 1 from orders where orders.id = order_id and orders.user_id = auth.uid())
);
create policy "Users create order items" on order_items for insert with check (
  exists (select 1 from orders where orders.id = order_id and orders.user_id = auth.uid())
);
create policy "Admins manage order items" on order_items for all using (is_admin());

-- Reviews: public read, own write
create policy "Public read reviews" on reviews for select to anon, authenticated using (true);
create policy "Users manage own reviews" on reviews for insert with check (auth.uid() = user_id);
create policy "Users update own reviews" on reviews for update using (auth.uid() = user_id);
create policy "Users delete own reviews" on reviews for delete using (auth.uid() = user_id);
