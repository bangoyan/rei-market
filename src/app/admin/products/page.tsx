"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil, Trash2, ShieldAlert } from "lucide-react";
import { useIsOwner } from "@/lib/hooks";
import type { Product, Category } from "@/types";

export default function AdminProductsPage() {
  const isOwner = useIsOwner();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase
        .from("products")
        .select("*, category:categories(name)")
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]);
    setProducts(prods ?? []);
    setCategories(cats ?? []);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (!isOwner) {
      alert("Mode demo: perubahan data dinonaktifkan.");
      return;
    }

    const payload = {
      name: editing.name,
      slug: editing.slug,
      description: editing.description,
      price: Number(editing.price),
      stock: Number(editing.stock),
      category_id: editing.category_id || null,
      images: editing.images ?? [],
      is_active: editing.is_active ?? true,
    };

    if (editing.id) {
      await supabase.from("products").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("products").insert(payload);
    }

    setEditing(null);
    loadData();
  }

  async function handleDelete(id: string) {
    if (!isOwner) {
      alert("Mode demo: perubahan data dinonaktifkan.");
      return;
    }
    if (!confirm("Hapus produk ini?")) return;
    await supabase.from("products").delete().eq("id", id);
    loadData();
  }

  function newProduct() {
    setEditing({
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock: 0,
      category_id: "",
      images: [],
      is_active: true,
    });
  }

  if (loading) {
    return <div className="animate-pulse h-8 w-48 rounded bg-border" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produk</h1>
        {isOwner ? (
          <button
            onClick={newProduct}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" /> Tambah Produk
          </button>
        ) : (
          <span className="flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
            <ShieldAlert className="h-3.5 w-3.5" /> Demo Mode: Read-Only
          </span>
        )}
      </div>

      {/* Edit/Create form */}
      {editing && (
        <form
          onSubmit={handleSave}
          className="mt-6 rounded-lg border border-border bg-surface p-4 space-y-4"
        >
          <h3 className="font-semibold">
            {editing.id ? "Edit Produk" : "Produk Baru"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="prod-name"
                className="mb-1 block text-sm font-medium"
              >
                Nama Produk
              </label>
              <input
                id="prod-name"
                required
                value={editing.name ?? ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    name: e.target.value,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, ""),
                  })
                }
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="prod-slug"
                className="mb-1 block text-sm font-medium"
              >
                Slug
              </label>
              <input
                id="prod-slug"
                required
                value={editing.slug ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, slug: e.target.value })
                }
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="prod-price"
                className="mb-1 block text-sm font-medium"
              >
                Harga (Rp)
              </label>
              <input
                id="prod-price"
                required
                type="number"
                value={editing.price ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, price: Number(e.target.value) })
                }
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="prod-stock"
                className="mb-1 block text-sm font-medium"
              >
                Stok
              </label>
              <input
                id="prod-stock"
                required
                type="number"
                value={editing.stock ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, stock: Number(e.target.value) })
                }
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="prod-cat"
                className="mb-1 block text-sm font-medium"
              >
                Kategori
              </label>
              <select
                id="prod-cat"
                value={editing.category_id ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, category_id: e.target.value })
                }
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">Tanpa kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="prod-images"
                className="mb-1 block text-sm font-medium"
              >
                URL Gambar (pisah koma)
              </label>
              <input
                id="prod-images"
                value={editing.images?.join(", ") ?? ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    images: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="prod-desc"
              className="mb-1 block text-sm font-medium"
            >
              Deskripsi
            </label>
            <textarea
              id="prod-desc"
              value={editing.description ?? ""}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
              rows={2}
              className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editing.is_active ?? true}
              onChange={(e) =>
                setEditing({ ...editing, is_active: e.target.checked })
              }
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            Produk aktif (tampil di toko)
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-background"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Product table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium text-muted">Nama</th>
              <th className="px-4 py-3 font-medium text-muted">Kategori</th>
              <th className="px-4 py-3 font-medium text-muted">Harga</th>
              <th className="px-4 py-3 font-medium text-muted">Stok</th>
              <th className="px-4 py-3 font-medium text-muted">Aktif</th>
              {isOwner && (
                <th className="px-4 py-3 font-medium text-muted">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3 text-muted">
                  {product.category?.name ?? "—"}
                </td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium ${
                      product.is_active ? "text-success" : "text-error"
                    }`}
                  >
                    {product.is_active ? "Ya" : "Tidak"}
                  </span>
                </td>
                {isOwner && (
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditing(product)}
                        className="rounded p-1 text-muted hover:text-foreground"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="rounded p-1 text-muted hover:text-error"
                        aria-label="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={isOwner ? 6 : 5}
                  className="px-4 py-8 text-center text-muted"
                >
                  Belum ada produk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
