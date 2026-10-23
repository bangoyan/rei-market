import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductDetail } from "./product-detail";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  await connection();
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(name, slug)")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profile:profiles(full_name, avatar_url)")
    .eq("product_id", id)
    .order("created_at", { ascending: false });

  return <ProductDetail product={product} reviews={reviews ?? []} />;
}
