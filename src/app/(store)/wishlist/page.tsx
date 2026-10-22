"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useCartStore } from "@/lib/store/cart";
import { useToastStore } from "@/lib/store/toast";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const toast = useToastStore((s) => s.show);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="h-8 w-48 animate-pulse rounded bg-border" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <Heart className="mx-auto h-16 w-16 text-border" />
        <h1 className="mt-4 text-xl font-bold">Your wishlist is empty</h1>
        <p className="mt-2 text-sm text-muted">
          Save products you like for later.
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Wishlist</h1>
      <p className="mt-1 text-sm text-muted">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <div
            key={product.id}
            className="rounded-lg border border-border bg-surface"
          >
            <Link href={`/products/${product.id}`}>
              <div className="relative aspect-square overflow-hidden rounded-t-lg bg-background">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted">
                    No image
                  </div>
                )}
              </div>
            </Link>
            <div className="p-3">
              <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
              <p className="mt-1 text-base font-bold text-secondary">
                {formatPrice(product.price)}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    addToCart(product);
                    removeItem(product.id);
                    toast(`${product.name} moved to cart`);
                  }}
                  className="flex flex-1 items-center justify-center gap-1 rounded-md bg-primary-dark px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary"
                >
                  <ShoppingCart className="h-3.5 w-3.5" /> Move to Cart
                </button>
                <button
                  onClick={() => removeItem(product.id)}
                  className="rounded-md border border-border px-2 py-2 text-xs text-muted hover:text-error"
                  aria-label="Remove from wishlist"
                >
                  <Heart className="h-3.5 w-3.5 fill-current" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
