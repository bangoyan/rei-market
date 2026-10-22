"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useToastStore } from "@/lib/store/toast";
import type { Product } from "@/types";

function isNew(createdAt: string) {
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 7 * 24 * 60 * 60 * 1000; // 7 days
}

export function ProductCard({ product }: { product: Product }) {
  const [mounted, setMounted] = useState(false);
  const addToCart = useCartStore((s) => s.addItem);
  const toast = useToastStore((s) => s.show);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const wishlisted = mounted && isInWishlist(product.id);
  const isNewProduct = isNew(product.created_at);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="group rounded-lg border border-border bg-surface transition-shadow hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-background">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">
              No image
            </div>
          )}
          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {isNewProduct && (
              <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-foreground">
                NEW
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="rounded bg-error px-1.5 py-0.5 text-[10px] font-bold text-white">
                Low Stock
              </span>
            )}
          </div>
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded bg-white px-2 py-1 text-xs font-medium text-error">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-medium leading-tight line-clamp-2 hover:text-primary">
            {product.name}
          </h3>
        </Link>
        {product.category && (
          <p className="mt-1 text-xs text-muted">{product.category.name}</p>
        )}
        <p className="mt-2 text-base font-bold text-secondary">
          {formatPrice(product.price)}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => {
              addToCart(product);
              toast(`${product.name} added to cart`);
            }}
            disabled={product.stock === 0}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary-dark px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-primary disabled:opacity-40"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </button>
          <button
            onClick={() =>
              wishlisted
                ? removeFromWishlist(product.id)
                : addToWishlist(product)
            }
            className={`rounded-md border p-2 transition-colors ${
              wishlisted
                ? "border-red-200 bg-red-50 text-red-500"
                : "border-border text-muted hover:text-red-500"
            }`}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className="h-3.5 w-3.5"
              fill={wishlisted ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
