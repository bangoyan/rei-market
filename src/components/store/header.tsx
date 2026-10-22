"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  LogOut,
  Package,
  X,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/lib/store/cart";
import { Logo } from "./logo";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const CATEGORIES = [
  { name: "Fresh Produce", slug: "fresh-produce" },
  { name: "Dairy & Eggs", slug: "dairy-eggs" },
  { name: "Bakery", slug: "bakery" },
  { name: "Beverages", slug: "beverages" },
  { name: "Snacks", slug: "snacks" },
  { name: "Pantry Staples", slug: "pantry-staples" },
];

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const rawItemCount = useCartStore((s) => s.itemCount());
  const itemCount = mounted ? rawItemCount : 0;

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setIsAdmin(data?.role === "admin");
      });
  }, [user, supabase]);

  // Close dropdowns on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-surface">
      {/* Rei Market signature green bar */}
      <div className="rei-topbar" />

      {/* Announcement bar */}
      <div className="bg-secondary px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
        Gratis ongkir untuk pesanan di atas{" "}
        <span className="font-bold text-accent">Rp 150.000</span>.{" "}
        <Link href="/products" className="underline underline-offset-2 hover:text-accent">
          Belanja sekarang
        </Link>
      </div>

      {/* Main nav */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Logo size="sm" />
            </Link>

            {/* Search bar (desktop) */}
            <form
              onSubmit={handleSearch}
              className="hidden flex-1 max-w-lg sm:flex"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari di Rei Market..."
                  className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Link
                href="/wishlist"
                className="rounded-md p-2 text-muted transition-colors hover:bg-background hover:text-foreground"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Link>

              <Link
                href="/cart"
                className="relative rounded-md p-2 text-muted transition-colors hover:bg-background hover:text-foreground"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="rounded-md p-2 text-muted transition-colors hover:bg-background hover:text-foreground"
                    aria-label="Account menu"
                  >
                    <User className="h-5 w-5" />
                  </button>
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 z-50 mt-1 w-48 rounded-lg border border-border bg-surface py-1 shadow-lg">
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary hover:bg-background"
                          >
                            <ShieldCheck className="h-4 w-4" /> Panel Admin
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-background"
                        >
                          <User className="h-4 w-4" /> Profil
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-background"
                        >
                          <Package className="h-4 w-4" /> Pesanan
                        </Link>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-error hover:bg-background"
                        >
                          <LogOut className="h-4 w-4" /> Keluar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="ml-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-md p-2 text-muted sm:hidden"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Search bar (mobile) */}
          <form onSubmit={handleSearch} className="pb-3 sm:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari di Rei Market..."
                className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Category nav (desktop) */}
      <nav className="hidden border-b border-border bg-surface sm:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ul className="flex items-center gap-1 overflow-x-auto py-2 text-sm">
            <li>
              <Link
                href="/products"
                className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-primary/5 hover:text-primary"
              >
                All Products
              </Link>
            </li>
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="inline-flex items-center rounded-md px-3 py-1.5 text-muted transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/20 sm:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-x-0 top-0 z-40 max-h-[80vh] overflow-y-auto bg-surface pt-2 pb-4 shadow-lg sm:hidden">
            <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
              <Logo size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-2 text-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-2 px-4">
              <p className="text-xs font-semibold uppercase text-muted mb-2">Categories</p>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-primary/5 hover:text-primary"
                  >
                    All Products
                  </Link>
                </li>
                {CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm text-muted hover:bg-primary/5 hover:text-primary"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
