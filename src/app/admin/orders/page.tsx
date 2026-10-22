"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { useIsOwner } from "@/lib/hooks";
import { ShieldAlert } from "lucide-react";

const STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu",
  processing: "Diproses",
  shipped: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
};

export default function AdminOrdersPage() {
  const isOwner = useIsOwner();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*, items:order_items(quantity)")
      .order("created_at", { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    if (!isOwner) {
      alert("Mode demo: perubahan status dinonaktifkan.");
      return;
    }
    await supabase.from("orders").update({ status }).eq("id", id);
    loadOrders();
  }

  if (loading) {
    return <div className="animate-pulse h-8 w-48 rounded bg-border" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pesanan</h1>
        {!isOwner && (
          <span className="flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
            <ShieldAlert className="h-3.5 w-3.5" /> Demo Mode: Read-Only
          </span>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium text-muted">ID Pesanan</th>
              <th className="px-4 py-3 font-medium text-muted">Pelanggan</th>
              <th className="px-4 py-3 font-medium text-muted">Item</th>
              <th className="px-4 py-3 font-medium text-muted">Total</th>
              <th className="px-4 py-3 font-medium text-muted">Status</th>
              <th className="px-4 py-3 font-medium text-muted">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3 font-mono text-xs">
                  {order.id.slice(0, 8)}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {order.user_id?.slice(0, 8) ?? "—"}
                </td>
                <td className="px-4 py-3">
                  {order.items?.reduce(
                    (s: number, i: any) => s + i.quantity,
                    0
                  ) ?? 0}
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatPrice(order.total)}
                </td>
                <td className="px-4 py-3">
                  {isOwner ? (
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`cursor-pointer rounded-full border-0 px-2.5 py-0.5 text-xs font-medium outline-none ${
                        STATUS_COLORS[order.status] ??
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s] ?? s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        STATUS_COLORS[order.status] ??
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                  )}
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
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  Belum ada pesanan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
