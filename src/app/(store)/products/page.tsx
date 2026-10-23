import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "./product-grid";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ search?: string; category?: string; sort?: string; minPrice?: string; maxPrice?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  await connection();
  const params = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  let query = supabase
    .from("products")
    .select("*, category:categories(name, slug)")
    .eq("is_active", true);

  if (params.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  if (params.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single();
    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  if (params.minPrice) {
    query = query.gte("price", parseInt(params.minPrice));
  }
  if (params.maxPrice) {
    query = query.lte("price", parseInt(params.maxPrice));
  }

  switch (params.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query.limit(50);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">
        {params.search
          ? `Results for "${params.search}"`
          : params.category
          ? `${categories?.find((c) => c.slug === params.category)?.name ?? "Category"}`
          : "All Products"}
      </h1>

      <ProductGrid
        products={products ?? []}
        categories={categories ?? []}
        currentCategory={params.category}
        currentSort={params.sort}
      />
    </div>
  );
}
