import Link from "next/link";
import { Logo } from "./logo";
import { Truck, ShieldCheck, Clock, CreditCard } from "lucide-react";

const TRUST = [
  { icon: Truck, text: "Gratis Ongkir >Rp 150k" },
  { icon: Clock, text: "Pesan Hari Ini, Sampai Besok" },
  { icon: ShieldCheck, text: "Produk Dicek Sebelum Kirim" },
  { icon: CreditCard, text: "Pembayaran Aman" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      {/* Trust bar */}
      <div className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4 sm:px-6">
          {TRUST.map((t) => (
            <div key={t.text} className="flex items-center gap-2.5">
              <t.icon className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-xs font-medium sm:text-sm">{t.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Logo size="sm" />
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Toko bahan makanan online untuk keluarga di Indonesia. Sayur,
              buah, dairy, dan kebutuhan dapur lainnya.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Belanja</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/products" className="hover:text-primary">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=fresh-produce"
                  className="hover:text-primary"
                >
                  Sayur &amp; Buah
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=dairy-eggs"
                  className="hover:text-primary"
                >
                  Dairy &amp; Telur
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=bakery"
                  className="hover:text-primary"
                >
                  Roti &amp; Kue
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Akun</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/profile" className="hover:text-primary">
                  Profil
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-primary">
                  Pesanan Saya
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-primary">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary">
                  Keranjang
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:px-6">
          <p className="text-xs text-muted">
            &copy; 2026 Rei Market. Portfolio project by{" "}
            <span className="font-medium text-foreground">Sofyan</span>.
          </p>
          <span className="text-xs text-muted">
            Built with Next.js + Supabase
          </span>
        </div>
      </div>
    </footer>
  );
}
