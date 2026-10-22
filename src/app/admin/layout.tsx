"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ArrowLeft,
} from "lucide-react";
import { Logo } from "@/components/store/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/orders", label: "Pesanan", icon: ShoppingCart },
  { href: "/admin/users", label: "Pengguna", icon: Users },
] as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-surface">
        <div className="rei-topbar" />
        <div className="p-4">
          <Link href="/" className="inline-block">
            <Logo size="sm" />
          </Link>
          <span className="mt-1.5 inline-block rounded bg-secondary px-2 py-0.5 text-[10px] font-semibold text-white">
            Admin
          </span>
        </div>
        <nav className="mt-2 space-y-0.5 px-2">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-foreground hover:bg-background"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="my-4 border-t border-border" />
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted hover:bg-background"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Toko
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-background p-6">{children}</main>
    </div>
  );
}
