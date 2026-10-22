"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/store/product-card";
import type { Product, Category } from "@/types";

interface Props {
  products: Product[];
  categories: Category[];
  currentCategory?: string;
  currentSort?: string;
}

export function ProductGrid({
  products,
  categories,
  currentCategory,
  currentSort,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <>
      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <select
          value={currentCategory ?? ""}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={currentSort ?? "newest"}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        <span className="ml-auto text-sm text-muted">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      {products.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg text-muted">No products found.</p>
          <button
            onClick={() => router.push("/products")}
            className="mt-4 text-sm font-medium text-primary hover:text-primary-dark"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
