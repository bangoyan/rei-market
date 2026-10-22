"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, total } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="h-8 w-48 animate-pulse rounded bg-border" />
        <div className="mt-6 space-y-3">
          <div className="h-24 animate-pulse rounded-lg bg-surface border border-border" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <ShoppingBag className="mx-auto h-16 w-16 text-border" />
        <h1 className="mt-4 text-xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted">
          Add some products to get started.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Shopping Cart</h1>
      <p className="mt-1 text-sm text-muted">
        {items.length} item{items.length !== 1 ? "s" : ""}
      </p>

      <div className="mt-6 space-y-3">
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex gap-4 rounded-lg border border-border bg-surface p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-background">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted">
                  No img
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <Link
                    href={`/products/${product.id}`}
                    className="text-sm font-medium hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-0.5 text-sm font-bold text-secondary">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(product.id)}
                  className="rounded p-1 text-muted hover:text-error"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-md border border-border">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="px-2 py-1 text-sm hover:bg-background"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="min-w-[1.5rem] text-center text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="px-2 py-1 text-sm hover:bg-background"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <p className="text-sm font-bold">
                  {formatPrice(product.price * quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total + checkout */}
      <div className="mt-6 rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold">Total</span>
          <span className="text-xl font-bold text-secondary">
            {formatPrice(total())}
          </span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 block rounded-md bg-primary px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
