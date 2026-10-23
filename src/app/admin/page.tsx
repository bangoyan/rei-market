import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingCart, Users, Wallet } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  await connection();
  const supabase = await createClient();

  const [
    { count: productCount },
    { count: orderCount },
    { count: userCount },
    { data: orders },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("total")
      .in("status", ["pending", "processing", "shipped", "delivered"]),
  ]);

  const totalRevenue = orders?.reduce((sum, o) => sum + o.total, 0) ?? 0;

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      label: "Produk",
      value: productCount ?? 0,
      icon: Package,
      color: "text-primary",
    },
    {
      label: "Pesanan",
      value: orderCount ?? 0,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      label: "Pelanggan",
      value: userCount ?? 0,
      icon: Users,
      color: "text-purple-600",
    },
    {
      label: "Pendapatan",
      value: formatPrice(totalRevenue),
      icon: Wallet,
      color: "text-accent",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Ringkasan</h1>

      {/* Stats cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">{stat.label}</span>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Pesanan Terbaru</h2>
        {recentOrders && recentOrders.length > 0 ? (
          <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 font-medium text-muted">
                    Pelanggan
                  </th>
                  <th className="px-4 py-3 font-medium text-muted">Total</th>
                  <th className="px-4 py-3 font-medium text-muted">Status</th>
                  <th className="px-4 py-3 font-medium text-muted">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      {order.user_id?.slice(0, 8) ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                          STATUS_COLORS[order.status] ??
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(order.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Belum ada pesanan.</p>
        )}
      </div>
    </div>
  );
}
