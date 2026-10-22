"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Star, ChevronLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useToastStore } from "@/lib/store/toast";
import { createClient } from "@/lib/supabase/client";
import type { Product, Review } from "@/types";

interface Props {
  product: Product;
  reviews: Review[];
}

export function ProductDetail({ product, reviews }: Props) {
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const addToCart = useCartStore((s) => s.addItem);
  const toast = useToastStore((s) => s.show);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const wishlisted = mounted && isInWishlist(product.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setReviewError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setReviewError("Please sign in to write a review.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      product_id: product.id,
      rating: reviewRating,
      comment: reviewComment || null,
    });

    if (error) {
      setReviewError(
        error.code === "23505"
          ? "You already reviewed this product."
          : error.message
      );
    } else {
      setReviewComment("");
      // simple reload to show new review
      window.location.reload();
    }
    setSubmitting(false);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg bg-background">
            {product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted">
                No image available
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
                    i === selectedImage ? "border-primary" : "border-border"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-sm text-primary hover:text-primary-dark"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{product.name}</h1>

          {reviews.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(avgRating)
                        ? "fill-accent text-accent"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted">
                {avgRating.toFixed(1)} ({reviews.length} review
                {reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          <p className="mt-4 text-3xl font-bold text-secondary">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {product.description}
            </p>
          )}

          <div className="mt-4 text-sm">
            {product.stock > 0 ? (
              <span className="text-success font-medium">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-error font-medium">Out of Stock</span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-md border border-border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-sm hover:bg-background"
              >
                -
              </button>
              <span className="min-w-[2rem] text-center text-sm">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="px-3 py-2 text-sm hover:bg-background"
              >
                +
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(product, quantity);
                toast(`${quantity}x ${product.name} added to cart`);
              }}
              disabled={product.stock === 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary-dark px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary disabled:opacity-40"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>

            <button
              onClick={() =>
                wishlisted
                  ? removeFromWishlist(product.id)
                  : addToWishlist(product)
              }
              className={`rounded-md border p-2.5 transition-colors ${
                wishlisted
                  ? "border-red-200 bg-red-50 text-red-500"
                  : "border-border text-muted hover:text-red-500"
              }`}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className="h-5 w-5"
                fill={wishlisted ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <section className="mt-16">
        <h2 className="text-xl font-bold">Reviews</h2>

        {/* Write review form */}
        <form
          onSubmit={handleReviewSubmit}
          className="mt-6 rounded-lg border border-border bg-surface p-4"
        >
          <h3 className="text-sm font-semibold">Write a Review</h3>
          {reviewError && (
            <p className="mt-2 text-sm text-error">{reviewError}</p>
          )}
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewRating(star)}
                className="p-0.5"
              >
                <Star
                  className={`h-5 w-5 ${
                    star <= reviewRating
                      ? "fill-accent text-accent"
                      : "text-border"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows={3}
            placeholder="Share your experience (optional)"
            className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        {/* Review list */}
        {reviews.length > 0 ? (
          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {review.profile?.full_name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {review.profile?.full_name ?? "Anonymous"}
                      </p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= review.rating
                                ? "fill-accent text-accent"
                                : "text-border"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-2 text-sm text-muted">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted">
            No reviews yet. Be the first to review this product.
          </p>
        )}
      </section>
    </div>
  );
}
