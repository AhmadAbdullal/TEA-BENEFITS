import { createSupabaseServerClient, getBrowserSupabase } from "@/lib/supabaseClient";

const ORDERS_TABLE = "الطلبات";

export type OrderStatus = "new" | "processing" | "shipped" | "completed" | "cancelled" | string;

export type OrderRecord = {
  id: number;
  product_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  quantity: number;
  total_price: number;
  status: OrderStatus;
  created_at: string;
  product?: {
    name: string;
  } | null;
};

export type OrderPayload = {
  product_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  quantity: number;
  total_price: number;
  status?: OrderStatus;
};

export async function submitOrder(payload: OrderPayload) {
  const supabase = getBrowserSupabase();
  const { error } = await supabase.from(ORDERS_TABLE).insert({ ...payload, status: payload.status ?? "new" });
  if (error) {
    console.error("Failed to submit order", error);
    return { success: false as const, message: error.message };
  }
  return { success: true as const };
}

type RawOrderRow = {
  id: number;
  product_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  quantity: number;
  total_price: number | string | null;
  status: OrderStatus | null;
  created_at: string;
  ["المنتج"]?: { name: string } | null;
};

export async function fetchOrders(): Promise<OrderRecord[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(ORDERS_TABLE)
    .select("*, المنتج:المنتجات(name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch orders", error);
    return [];
  }

  const rows: RawOrderRow[] = Array.isArray(data) ? (data as RawOrderRow[]) : [];

  if (!Array.isArray(data)) {
    console.error("Unexpected orders payload", data);
  }

  return rows.map((item) => ({
    id: item.id,
    product_id: item.product_id,
    customer_name: item.customer_name,
    customer_email: item.customer_email,
    customer_phone: item.customer_phone,
    customer_address: item.customer_address,
    quantity: item.quantity,
    total_price: Number(item.total_price ?? 0),
    status: item.status ?? "new",
    created_at: item.created_at,
    product: item["المنتج"] ?? null
  }));
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  const supabase = getBrowserSupabase();
  const { error } = await supabase.from(ORDERS_TABLE).update({ status }).eq("id", id);
  if (error) {
    console.error("Failed to update order status", error);
    return { success: false as const, message: error.message };
  }
  return { success: true as const };
}
