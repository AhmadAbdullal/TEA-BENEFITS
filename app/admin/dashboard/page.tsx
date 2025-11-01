"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAdmin } from "@/contexts/AdminContext";
import type { Product } from "@/contexts/CartContext";
import { addNewProduct, deleteProduct, updateProduct, uploadProductImage } from "@/lib/products";
import { getBrowserSupabase } from "@/lib/supabaseClient";
import type { OrderRecord, OrderStatus } from "@/lib/orders";
import { updateOrderStatus } from "@/lib/orders";

const DELIVERY_FEE = 2;
const ORDER_STATUSES: OrderStatus[] = ["new", "processing", "shipped", "completed", "cancelled"];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [addProductError, setAddProductError] = useState<string | null>(null);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({
    name: "",
    description: "",
    details: "",
    price: "",
    shipping_cost: "",
    stock: ""
  });
  const [newProductValues, setNewProductValues] = useState({
    name: "",
    description: "",
    details: "",
    price: "4",
    shipping_cost: String(DELIVERY_FEE),
    stock: "10"
  });
  const [newProductImage, setNewProductImage] = useState<File | null>(null);
  const productsRef = useRef<Product[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      const supabase = getBrowserSupabase();
      const { data: productData, error: productError } = await supabase
        .from("المنتجات")
        .select("*")
        .order("created_at", { ascending: false });

      let mappedProducts: Product[] = [];

      if (!productError && productData) {
        mappedProducts = productData.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description ?? undefined,
          details: item.details ?? undefined,
          price: item.price ?? 0,
          shipping_cost: item.shipping_cost ?? undefined,
          image_url: item.image_url ?? undefined,
          stock: item.stock ?? undefined
        }));
        setProducts(mappedProducts);
        productsRef.current = mappedProducts;
      }

      const fallbackProducts = mappedProducts.length > 0 ? mappedProducts : productsRef.current;

      const { data: orderData, error: orderError } = await supabase
        .from("الطلبات")
        .select("*")
        .order("created_at", { ascending: false });

      if (!orderError && orderData) {
        setOrders(
          orderData.map((order) => {
            const productMatch = fallbackProducts.find((product) => product.id === order.product_id);
            return (
              {
                id: order.id,
                product_id: order.product_id,
                customer_name: order.customer_name,
                customer_email: order.customer_email,
                customer_phone: order.customer_phone,
                customer_address: order.customer_address,
                quantity: order.quantity,
                total_price: Number(order.total_price ?? 0),
                status: order.status ?? "new",
                created_at: order.created_at,
                product: productMatch ? { name: productMatch.name } : null
              } satisfies OrderRecord
            );
          })
        );
      }
    };

    void loadData();
  }, [isAuthenticated]);

  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + Number(order.total_price ?? 0), 0), [orders]);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const handleAddProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;

    setIsBusy(true);
    setAddProductError(null);

    try {
      let imageUrl: string | undefined;
      if (newProductImage) {
        const uploadResult = await uploadProductImage(newProductImage);
        if (!uploadResult.success) {
          throw new Error(uploadResult.message);
        }
        imageUrl = uploadResult.url;
      }

      const payload = {
        name: newProductValues.name,
        description: newProductValues.description,
        details: newProductValues.details,
        price: Number(newProductValues.price || 0),
        shipping_cost: Number(newProductValues.shipping_cost || DELIVERY_FEE),
        stock: Number(newProductValues.stock || 0),
        image_url: imageUrl ?? null
      };

      const response = await addNewProduct(payload);
      if (!response.success) {
        throw new Error(response.message);
      }

      setNewProductValues({
        name: "",
        description: "",
        details: "",
        price: "",
        shipping_cost: String(DELIVERY_FEE),
        stock: ""
      });
      setNewProductImage(null);

      const supabase = getBrowserSupabase();
      const { data } = await supabase
        .from("المنتجات")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) {
        const mapped = data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description ?? undefined,
          details: item.details ?? undefined,
          price: item.price ?? 0,
          shipping_cost: item.shipping_cost ?? undefined,
          image_url: item.image_url ?? undefined,
          stock: item.stock ?? undefined
        }));
        setProducts(mapped);
        productsRef.current = mapped;
      }
    } catch (error) {
      console.error(error);
      setAddProductError(error instanceof Error ? error.message : "Unable to add product");
    } finally {
      setIsBusy(false);
    }
  };

  const startEditing = (product: Product) => {
    setEditProductId(product.id);
    setEditValues({
      name: product.name,
      description: product.description ?? "",
      details: product.details ?? "",
      price: String(product.price),
      shipping_cost: String(product.shipping_cost ?? DELIVERY_FEE),
      stock: String(product.stock ?? 0)
    });
  };

  const handleUpdateProduct = async (event: FormEvent<HTMLFormElement>, productId: number) => {
    event.preventDefault();
    if (isBusy) return;
    setIsBusy(true);

    try {
      const payload = {
        name: editValues.name,
        description: editValues.description,
        details: editValues.details,
        price: Number(editValues.price || 0),
        shipping_cost: Number(editValues.shipping_cost || DELIVERY_FEE),
        stock: Number(editValues.stock || 0)
      };

      const response = await updateProduct(productId, payload);
      if (!response.success) {
        throw new Error(response.message);
      }

      setProducts((prev) => {
        const next = prev.map((item) => (item.id === productId ? { ...item, ...payload } : item));
        productsRef.current = next;
        return next;
      });
      setEditProductId(null);
      setAddProductError(null);
    } catch (error) {
      console.error(error);
      setAddProductError(error instanceof Error ? error.message : "Unable to update product");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      const response = await deleteProduct(productId);
      if (!response.success) {
        throw new Error(response.message);
      }
      setProducts((prev) => {
        const next = prev.filter((product) => product.id !== productId);
        productsRef.current = next;
        return next;
      });
      setAddProductError(null);
    } catch (error) {
      console.error(error);
      setAddProductError(error instanceof Error ? error.message : "Unable to delete product");
    } finally {
      setIsBusy(false);
    }
  };

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    try {
      const result = await updateOrderStatus(orderId, status);
      if (!result.success) {
        throw new Error(result.message);
      }
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
      setAddProductError(null);
    } catch (error) {
      console.error(error);
      setAddProductError(error instanceof Error ? error.message : "Unable to update order status");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-12 px-6 py-16">
      <header className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-gold-brand">Dashboard</p>
          <h1 className="font-display text-4xl text-purple-brand">Welcome back</h1>
          <p className="text-sm text-purple-brand/60">Manage products, track orders, and keep customers smiling.</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="self-start rounded-full border border-gold-brand px-6 py-2 text-sm font-semibold text-purple-brand transition hover:bg-gold-brand/20"
        >
          Sign out
        </button>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
        <DashboardMetric label="Orders" value={totalOrders.toString()} />
        <DashboardMetric label="Revenue" value={`${totalRevenue.toFixed(3)} KWD`} />
        <DashboardMetric label="Products" value={totalProducts.toString()} />
      </section>

      <section className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-purple-brand">Products</h2>
        </div>
        {addProductError && (
          <p className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">{addProductError}</p>
        )}
        <div className="grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={handleAddProduct}
            className="space-y-4 rounded-3xl border border-purple-brand/10 bg-white p-6 shadow-lg shadow-purple-brand/10"
          >
            <h3 className="font-display text-2xl text-purple-brand">Add new product</h3>
            <input
              value={newProductValues.name}
              onChange={(event) => setNewProductValues((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Product name"
              required
              className="w-full rounded-full border border-purple-brand/20 bg-purple-brand/5 px-4 py-3 text-purple-brand focus:border-purple-brand focus:outline-none"
            />
            <textarea
              value={newProductValues.description}
              onChange={(event) => setNewProductValues((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Short description"
              rows={2}
              className="w-full rounded-3xl border border-purple-brand/20 bg-purple-brand/5 px-4 py-3 text-purple-brand focus:border-purple-brand focus:outline-none"
            />
            <textarea
              value={newProductValues.details}
              onChange={(event) => setNewProductValues((prev) => ({ ...prev, details: event.target.value }))}
              placeholder="Extra details"
              rows={3}
              className="w-full rounded-3xl border border-purple-brand/20 bg-purple-brand/5 px-4 py-3 text-purple-brand focus:border-purple-brand focus:outline-none"
            />
            <div className="grid grid-cols-3 gap-3 text-sm">
              <label className="space-y-2">
                <span className="text-xs uppercase text-purple-brand/60">Price (KWD)</span>
                <input
                  value={newProductValues.price}
                  onChange={(event) => setNewProductValues((prev) => ({ ...prev, price: event.target.value }))}
                  type="number"
                  step="0.001"
                  required
                  className="w-full rounded-full border border-purple-brand/20 bg-purple-brand/5 px-4 py-2 text-purple-brand focus:border-purple-brand focus:outline-none"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase text-purple-brand/60">Shipping (KWD)</span>
                <input
                  value={newProductValues.shipping_cost}
                  onChange={(event) => setNewProductValues((prev) => ({ ...prev, shipping_cost: event.target.value }))}
                  type="number"
                  step="0.001"
                  className="w-full rounded-full border border-purple-brand/20 bg-purple-brand/5 px-4 py-2 text-purple-brand focus:border-purple-brand focus:outline-none"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase text-purple-brand/60">Stock</span>
                <input
                  value={newProductValues.stock}
                  onChange={(event) => setNewProductValues((prev) => ({ ...prev, stock: event.target.value }))}
                  type="number"
                  className="w-full rounded-full border border-purple-brand/20 bg-purple-brand/5 px-4 py-2 text-purple-brand focus:border-purple-brand focus:outline-none"
                />
              </label>
            </div>
            <label className="space-y-2 text-sm text-purple-brand">
              <span>Product image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setNewProductImage(event.target.files?.[0] ?? null)}
                className="w-full text-sm text-purple-brand"
              />
            </label>
            <button
              type="submit"
              disabled={isBusy}
              className="w-full rounded-full bg-purple-brand px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-purple-brand/30 transition hover:-translate-y-0.5 hover:bg-purple-brand/90 disabled:cursor-not-allowed disabled:bg-purple-brand/40"
            >
              {isBusy ? "Saving..." : "Add product"}
            </button>
          </form>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="space-y-4 rounded-3xl border border-purple-brand/10 bg-white p-6 shadow-lg shadow-purple-brand/10">
                <div className="flex items-start gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-purple-brand/10 bg-purple-brand/5">
                    <Image
                      src={product.image_url || "/mood-herbal-tea.svg"}
                      alt={product.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl text-purple-brand">{product.name}</h3>
                    <p className="text-sm text-purple-brand/60">{product.description}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-purple-brand/60">
                      <span className="rounded-full bg-purple-brand/10 px-3 py-1">Price: {product.price} KWD</span>
                      <span className="rounded-full bg-purple-brand/10 px-3 py-1">Shipping: {product.shipping_cost ?? DELIVERY_FEE} KWD</span>
                      <span className="rounded-full bg-purple-brand/10 px-3 py-1">Stock: {product.stock ?? 0}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(product)}
                      className="rounded-full border border-gold-brand px-4 py-1 text-xs font-semibold uppercase tracking-wide text-purple-brand transition hover:bg-gold-brand/20"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="rounded-full border border-red-200 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-red-500 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {editProductId === product.id && (
                  <form className="space-y-3" onSubmit={(event) => handleUpdateProduct(event, product.id)}>
                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        value={editValues.name}
                        onChange={(event) => setEditValues((prev) => ({ ...prev, name: event.target.value }))}
                        className="rounded-full border border-purple-brand/20 bg-purple-brand/5 px-4 py-2 text-sm text-purple-brand focus:border-purple-brand focus:outline-none"
                      />
                      <input
                        value={editValues.price}
                        onChange={(event) => setEditValues((prev) => ({ ...prev, price: event.target.value }))}
                        type="number"
                        step="0.001"
                        className="rounded-full border border-purple-brand/20 bg-purple-brand/5 px-4 py-2 text-sm text-purple-brand focus:border-purple-brand focus:outline-none"
                      />
                      <input
                        value={editValues.shipping_cost}
                        onChange={(event) => setEditValues((prev) => ({ ...prev, shipping_cost: event.target.value }))}
                        type="number"
                        step="0.001"
                        className="rounded-full border border-purple-brand/20 bg-purple-brand/5 px-4 py-2 text-sm text-purple-brand focus:border-purple-brand focus:outline-none"
                      />
                      <input
                        value={editValues.stock}
                        onChange={(event) => setEditValues((prev) => ({ ...prev, stock: event.target.value }))}
                        type="number"
                        className="rounded-full border border-purple-brand/20 bg-purple-brand/5 px-4 py-2 text-sm text-purple-brand focus:border-purple-brand focus:outline-none"
                      />
                    </div>
                    <textarea
                      value={editValues.description}
                      onChange={(event) => setEditValues((prev) => ({ ...prev, description: event.target.value }))}
                      rows={2}
                      className="w-full rounded-3xl border border-purple-brand/20 bg-purple-brand/5 px-4 py-2 text-sm text-purple-brand focus:border-purple-brand focus:outline-none"
                    />
                    <textarea
                      value={editValues.details}
                      onChange={(event) => setEditValues((prev) => ({ ...prev, details: event.target.value }))}
                      rows={3}
                      className="w-full rounded-3xl border border-purple-brand/20 bg-purple-brand/5 px-4 py-2 text-sm text-purple-brand focus:border-purple-brand focus:outline-none"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        className="rounded-full bg-purple-brand px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-purple-brand/30"
                      >
                        Save changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditProductId(null)}
                        className="rounded-full border border-purple-brand/20 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-purple-brand"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-6">
        <h2 className="font-display text-3xl text-purple-brand">Orders</h2>
        <div className="overflow-hidden rounded-3xl border border-purple-brand/10 bg-white shadow-lg shadow-purple-brand/10">
          <table className="min-w-full divide-y divide-purple-brand/10 text-left text-sm">
            <thead className="bg-purple-brand/10 text-xs uppercase tracking-wide text-purple-brand/70">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-brand/10">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-purple-brand/60">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const product = products.find((item) => item.id === order.product_id);
                  return (
                    <tr key={order.id} className="hover:bg-purple-brand/5">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-purple-brand">#{order.id}</div>
                        <div className="text-xs text-purple-brand/60">{product?.name || "Unknown"}</div>
                        <div className="text-xs text-purple-brand/40">{new Date(order.created_at).toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-purple-brand">{order.customer_name}</div>
                        <div className="text-xs text-purple-brand/60">{order.customer_address}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-purple-brand/60">
                        <div>{order.customer_email || "—"}</div>
                        <div>{order.customer_phone}</div>
                      </td>
                      <td className="px-4 py-3">{order.quantity}</td>
                      <td className="px-4 py-3">{Number(order.total_price).toFixed(3)} KWD</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(event) => handleStatusChange(order.id, event.target.value)}
                          className="rounded-full border border-purple-brand/20 bg-purple-brand/5 px-3 py-1 text-xs font-semibold text-purple-brand focus:border-purple-brand focus:outline-none"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

type DashboardMetricProps = {
  label: string;
  value: string;
};

function DashboardMetric({ label, value }: DashboardMetricProps) {
  return (
    <div className="rounded-3xl border border-purple-brand/10 bg-white p-6 text-purple-brand shadow-lg shadow-purple-brand/10">
      <p className="text-xs uppercase tracking-[0.35em] text-gold-brand">{label}</p>
      <p className="mt-4 font-display text-3xl">{value}</p>
    </div>
  );
}
