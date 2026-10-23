import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default async function OrdersPage() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/orders");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, items:order_items(*, product:products(name, images))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!orders || orders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <Package className="mx-auto h-16 w-16 text-border" />
        <h1 className="mt-4 text-xl font-bold">Belum ada pesanan</h1>
        <p className="mt-2 text-sm text-muted">
          Riwayat pesanan kamu akan muncul di sini.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Pesanan Saya</h1>

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">
                  {new Date(order.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  ID: {order.id.slice(0, 8)}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                  STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Order status tracker */}
            <div className="mt-4 flex items-center gap-1">
              {["pending", "processing", "shipped", "delivered"].map(
                (s, i, arr) => {
                  const idx = arr.indexOf(order.status);
                  const active = i <= idx;
                  return (
                    <div key={s} className="flex flex-1 flex-col items-center">
                      <div
                        className={`h-2 w-full rounded-full ${
                          active ? "bg-primary" : "bg-border"
                        }`}
                      />
                      <span className="mt-1 text-[10px] text-muted capitalize">
                        {s}
                      </span>
                    </div>
                  );
                }
              )}
            </div>

            {/* Items */}
            <div className="mt-4 space-y-2">
              {order.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted">
                    {item.product?.name ?? "Product"} x{item.quantity}
                  </span>
                  <span>{formatPrice(item.price_at_purchase * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 border-t border-border pt-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-base font-bold text-secondary">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
