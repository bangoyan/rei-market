# Rei Market

Modern supermarket e-commerce web application built with Next.js App Router, Supabase, and Tailwind CSS. Built as a portfolio project showcasing production-grade frontend architecture, database design with Row Level Security (RLS), and accessible UI/UX.

🌐 **Portfolio**: [bangoyan.web.id](https://bangoyan.web.id)

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, Server & Client Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom theme design tokens
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Auth)
- **State Management**: Zustand (client-side cart & wishlist sync)
- **Icons**: Lucide React
- **Accessibility & Contrast**: WCAG AA Compliant

---

## Key Features

### 🛒 Customer Storefront
- **Dynamic Hero Banner**: Auto-slide promotional carousel with smooth crossfade and touch/swipe support.
- **Product Browsing**: Search, filter by category, sort by price and arrival date.
- **Product Detail**: Responsive layout with image preview, stock indicators, and reviews.
- **Cart & Wishlist**: Fast local state backed by Zustand with optimistic UI updates.
- **Checkout Flow**: Multi-step checkout with mock delivery and payment selection.
- **Order Tracking**: Order history with chronological status progress indicator.
- **Customer Profile**: Personal details, shipping address, and account management.

### 🛡️ Admin Dashboard (Demo-Safe)
- **Store Overview**: Real-time business metrics (products, orders, revenue, customer accounts).
- **Product Management**: Catalog CRUD with image preview, category assignment, and stock toggles.
- **Order Processing**: Live order inspection and fulfillment status updates.
- **User Roles**: Account management with customer/admin role assignment.
- **Demo Mode Isolation**: Non-owner admin access is strictly **read-only** at both the UI level and Supabase database level (RLS) to prevent tampering.

---

## Security & Demo Admin Protection

To allow portfolio visitors to explore the admin panel safely without risk of data deletion or vandalism:
1. **Database RLS Policies**: `supabase/protect_demo_admin.sql` restricts write operations (`INSERT`, `UPDATE`, `DELETE`) on products, orders, and users exclusively to the verified owner.
2. **UI Guards**: Write actions and destructive buttons are hidden from demo accounts, showing a clear `Demo Mode: Read-Only` status badge.

---

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- A [Supabase](https://supabase.com) account (free tier)

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/rei-market.git
cd rei-market
npm install
```

### 2. Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Configure your keys in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_OWNER_ID=your-supabase-user-uuid
```

### 3. Database Setup
In your Supabase project dashboard > **SQL Editor**, execute in order:
1. `supabase/migrations/001_schema.sql` — Creates tables, triggers, and baseline RLS.
2. `supabase/seed.sql` — Populates sample grocery products and categories.
3. *(Optional for public demo)* `supabase/protect_demo_admin.sql` — Enforces read-only restrictions for demo admin visitors.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
├── public/                 # Static assets & brand icons
├── src/
│   ├── app/
│   │   ├── (auth)/         # Login & registration pages
│   │   ├── (store)/        # Customer-facing storefront
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   └── profile/
│   │   ├── admin/          # Admin management portal
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   └── users/
│   │   └── globals.css     # Tailwind v4 theme configuration
│   ├── components/
│   │   └── store/          # Storefront UI components
│   ├── lib/
│   │   ├── hooks.ts        # Reusable client hooks (owner checks)
│   │   ├── store/          # Zustand global stores
│   │   ├── supabase/       # SSR & browser Supabase clients
│   │   └── utils.ts        # Currency formatting & helpers
│   └── types/              # TypeScript interfaces & types
└── supabase/
    ├── migrations/         # Baseline database schema
    ├── seed.sql            # Sample product seed data
    └── protect_demo_admin.sql  # RLS safety policies for demo
```

---

## License

MIT
