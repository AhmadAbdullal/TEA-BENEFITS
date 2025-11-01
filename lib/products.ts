import { createSupabaseServerClient, getBrowserSupabase } from "@/lib/supabaseClient";
import type { Product } from "@/contexts/CartContext";

const PRODUCTS_TABLE = "المنتجات";
const STORAGE_BUCKET = "انواع الشاي";

export async function fetchProducts(): Promise<Product[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from(PRODUCTS_TABLE).select("*").order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch products", error);
    return [];
  }

  return (data ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description ?? undefined,
    details: item.details ?? undefined,
    price: item.price ?? 0,
    shipping_cost: item.shipping_cost ?? undefined,
    image_url: item.image_url ?? undefined,
    stock: item.stock ?? undefined
  }));
}

export type ProductPayload = {
  name: string;
  description?: string;
  details?: string;
  price: number;
  shipping_cost?: number;
  stock?: number;
  image_url?: string | null;
};

export async function uploadProductImage(file: File) {
  const supabase = getBrowserSupabase();
  const extension = file.name.split(".").pop() || "jpg";
  const fileName = `${crypto.randomUUID()}.${extension}`;

  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file, {
    upsert: false,
    cacheControl: "3600"
  });

  if (error) {
    console.error("Image upload failed", error);
    return { success: false as const, message: error.message };
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);

  return { success: true as const, url: publicUrl };
}

export async function addNewProduct(payload: ProductPayload) {
  const supabase = getBrowserSupabase();
  const { error } = await supabase.from(PRODUCTS_TABLE).insert(payload);
  if (error) {
    console.error("Failed to add product", error);
    return { success: false as const, message: error.message };
  }
  return { success: true as const };
}

export async function updateProduct(id: number, payload: Partial<ProductPayload>) {
  const supabase = getBrowserSupabase();
  const { error } = await supabase.from(PRODUCTS_TABLE).update(payload).eq("id", id);
  if (error) {
    console.error("Failed to update product", error);
    return { success: false as const, message: error.message };
  }
  return { success: true as const };
}

export async function deleteProduct(id: number) {
  const supabase = getBrowserSupabase();
  const { error } = await supabase.from(PRODUCTS_TABLE).delete().eq("id", id);
  if (error) {
    console.error("Failed to delete product", error);
    return { success: false as const, message: error.message };
  }
  return { success: true as const };
}
