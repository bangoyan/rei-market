"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";

type Step = "address" | "confirm" | "success";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { items, total, clearCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0 && step !== "success") {
      router.push("/cart");
    }
  }, [mounted, items.length, step, router]);

  if (!mounted || (items.length === 0 && step !== "success")) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
        <div className="h-8 w-48 animate-pulse rounded bg-border" />
      </div>
    );
  }

  async function handlePlaceOrder() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total: total(),
        shipping_address: address,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      setError(orderError?.message ?? "Failed to create order");
      setLoading(false);
      return;
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price_at_purchase: item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      setError(itemsError.message);
      setLoading(false);
      return;
    }

    setOrderId(order.id);
    clearCart();
    setStep("success");
    setLoading(false);
  }

  if (step === "success") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <CheckCircle className="mx-auto h-16 w-16 text-success" />
        <h1 className="mt-4 text-2xl font-bold">Order Placed!</h1>
        <p className="mt-2 text-sm text-muted">
          Your order has been received. We&apos;ll start processing it soon.
        </p>
        {orderId && (
          <p className="mt-1 text-xs text-muted">Order ID: {orderId}</p>
        )}
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => router.push("/orders")}
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            View Orders
          </button>
          <button
            onClick={() => router.push("/products")}
            className="rounded-md border border-border px-6 py-2.5 text-sm font-medium hover:bg-background"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-error">
          {error}
        </div>
      )}

      {step === "address" && (
        <div className="mt-6">
          <label className="mb-1 block text-sm font-medium">
            Shipping Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            required
            placeholder="Full address including city and postal code"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            onClick={() => setStep("confirm")}
            disabled={!address.trim()}
            className="mt-4 w-full rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-40"
          >
            Continue to Review
          </button>
        </div>
      )}

      {step === "confirm" && (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-border bg-surface p-4">
            <h3 className="text-sm font-semibold">Shipping to</h3>
            <p className="mt-1 text-sm text-muted">{address}</p>
            <button
              onClick={() => setStep("address")}
              className="mt-2 text-xs text-primary hover:text-primary-dark"
            >
              Change
            </button>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            <h3 className="text-sm font-semibold">Order Summary</h3>
            <div className="mt-3 space-y-2">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted">
                    {product.name} x{quantity}
                  </span>
                  <span>{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 flex items-center justify-between font-bold">
                <span>Total</span>
                <span className="text-secondary">{formatPrice(total())}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? "Processing..." : "Place Order (Mock Payment)"}
          </button>
          <p className="text-center text-xs text-muted">
            This is a demo. No real payment is processed.
          </p>
        </div>
      )}
    </div>
  );
}
