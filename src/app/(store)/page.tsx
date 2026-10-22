import { connection } from "next/server";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import {
  Tag,
  Flame,
  Leaf,
  Clock,
  Truck,
  BadgeCheck,
} from "lucide-react";
import { PromoBanner } from "@/components/store/promo-banner";
import { NewsletterForm } from "@/components/store/newsletter-form";
import { ProductRow } from "./product-row";

export const instant = false;

export default async function HomePage() {
  await connection();
  const supabase = await createClient();

  const [{ data: categories }, { data: allProducts }] = await Promise.all([
    supabase.from("categories").select("*").limit(6),
    supabase
      .from("products")
      .select("*, category:categories(name)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(18),
  ]);

  // Split products for different sections
  const budgetPicks = (allProducts ?? []).filter(
    (p) => p.price < 30000
  ).slice(0, 4);
  const popularProducts = (allProducts ?? []).slice(0, 4);
  const newArrivals = (allProducts ?? []).slice(4, 8);

  return (
    <div>
      {/* ── Hero Banner ── */}
      <PromoBanner />

      {/* ── Promo Banners ── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/products?category=fresh-produce"
            className="flex items-center gap-4 rounded-lg bg-green-50 p-5 transition-shadow hover:shadow-md"
          >
            <div className="rounded-full bg-primary/10 p-3">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Produk Segar</p>
              <p className="mt-0.5 text-xs text-muted">
                Dari petani lokal, update tiap hari
              </p>
            </div>
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-4 rounded-lg bg-amber-50 p-5 transition-shadow hover:shadow-md"
          >
            <div className="rounded-full bg-accent/10 p-3">
              <Clock className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-700">
                Promo Akhir Pekan
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Pilihan baru setiap akhir pekan
              </p>
            </div>
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-4 rounded-lg bg-blue-50 p-5 transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1"
          >
            <div className="rounded-full bg-secondary/10 p-3">
              <Truck className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">
                Gratis Ongkir
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Pesanan di atas Rp 150.000
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Budget Picks ── */}
      {budgetPicks.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-bold">Budget Picks</h2>
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-foreground">
                  Under Rp 30k
                </span>
              </div>
              <Link
                href="/products"
                className="text-sm font-medium text-amber-800 hover:underline"
              >
                Lihat semua
              </Link>
            </div>
            <div className="mt-4">
              <ProductRow products={budgetPicks} />
            </div>
          </div>
        </section>
      )}

      {/* ── Shop by Category ── */}
      {categories && categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Belanja per Kategori</h2>
            <Link
              href="/products"
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              Lihat semua
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group overflow-hidden rounded-lg border border-border bg-surface transition-all hover:border-primary hover:shadow-md"
              >
                {cat.image_url ? (
                  <div className="aspect-[4/3] overflow-hidden bg-background">
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      width={400}
                      height={300}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-background" />
                )}
                <p className="px-3 py-2.5 text-center text-sm font-medium">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Popular Products ── */}
      {popularProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Paling Laris</h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              Lihat semua
            </Link>
          </div>
          <div className="mt-6">
            <ProductRow products={popularProducts} />
          </div>
        </section>
      )}

      {/* ── New Arrivals ── */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Baru Masuk</h2>
            <Link
              href="/products"
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              Lihat semua
            </Link>
          </div>
          <div className="mt-6">
            <ProductRow products={newArrivals} />
          </div>
        </section>
      )}

      {/* ── Kenapa Rei Market ── */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 sm:grid-cols-4">
            {[
              {
                icon: Leaf,
                title: "Dari Petani Lokal",
                desc: "Dipanen pagi, dikirim hari itu juga.",
              },
              {
                icon: Truck,
                title: "Diantar ke Rumah",
                desc: "Pesan hari ini, sampai besok.",
              },
              {
                icon: BadgeCheck,
                title: "Dicek Sebelum Kirim",
                desc: "Setiap pesanan dicek kualitasnya.",
              },
              {
                icon: Clock,
                title: "Retur 24 Jam",
                desc: "Gak puas? Kembalikan dalam 24 jam.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6">
          <h2 className="text-xl font-bold text-white">
            Jangan Lewatkan Promo Mingguan
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-300">
            Daftar untuk dapat info produk baru dan penawaran khusus dari Rei
            Market.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* Empty state */}
      {(!allProducts || allProducts.length === 0) && (
        <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <p className="text-lg text-muted">
            Belum ada produk. Cek lagi nanti!
          </p>
        </section>
      )}
    </div>
  );
}
