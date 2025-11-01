"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CartSummary from "@/components/CartSummary";
import { useCart } from "@/contexts/CartContext";
import { submitOrder } from "@/lib/orders";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, deliveryFee, calculateSubtotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCartEmpty = items.length === 0;

  const total = useMemo(() => calculateSubtotal() + deliveryFee, [calculateSubtotal, deliveryFee]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isCartEmpty) {
      setError("Add products to your cart before checking out.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const customer_name = String(form.get("name") || "").trim();
    const customer_email = String(form.get("email") || "").trim();
    const customer_phone = String(form.get("phone") || "").trim();
    const customer_address = String(form.get("address") || "").trim();

    if (!customer_name || !customer_phone || !customer_address) {
      setError("Name, phone, and address are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let shippingApplied = false;

      for (const item of items) {
        const total_price = item.product.price * item.quantity + (!shippingApplied ? deliveryFee : 0);
        shippingApplied = true;

        const response = await submitOrder({
          product_id: item.product.id,
          quantity: item.quantity,
          total_price,
          customer_name,
          customer_email,
          customer_phone,
          customer_address
        });

        if (!response.success) {
          throw new Error(response.message || "Unable to submit order");
        }
      }

      clearCart();
      router.push("/success");
    } catch (submitError) {
      console.error(submitError);
      setError(submitError instanceof Error ? submitError.message : "Unable to process order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl gap-12 px-6 py-16 lg:grid lg:grid-cols-2">
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-gold-brand">Checkout</p>
          <h1 className="font-display text-4xl text-purple-brand">Customer Details</h1>
        </header>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-purple-brand/10 bg-white p-8 shadow-lg shadow-purple-brand/10"
        >
          <div className="grid gap-4">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-purple-brand">Full name</span>
              <input
                name="name"
                type="text"
                required
                className="w-full rounded-full border border-purple-brand/20 bg-purple-brand/5 px-4 py-3 text-purple-brand focus:border-purple-brand focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-purple-brand">Email</span>
              <input
                name="email"
                type="email"
                className="w-full rounded-full border border-purple-brand/20 bg-purple-brand/5 px-4 py-3 text-purple-brand focus:border-purple-brand focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-purple-brand">Phone number</span>
              <input
                name="phone"
                type="tel"
                required
                className="w-full rounded-full border border-purple-brand/20 bg-purple-brand/5 px-4 py-3 text-purple-brand focus:border-purple-brand focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-purple-brand">Delivery address</span>
              <textarea
                name="address"
                required
                rows={4}
                className="w-full rounded-3xl border border-purple-brand/20 bg-purple-brand/5 px-4 py-3 text-purple-brand focus:border-purple-brand focus:outline-none"
              />
            </label>
            <div className="space-y-1 rounded-2xl border border-gold-brand/40 bg-gold-brand/10 px-4 py-3 text-sm text-purple-brand/80">
              <p className="font-semibold text-purple-brand">Payment</p>
              <p>
                Payment integration coming soon. We will contact you via email or phone to confirm the best payment option.
              </p>
            </div>
          </div>
          {error && <p className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isCartEmpty || isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-purple-brand px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-purple-brand/30 transition hover:-translate-y-0.5 hover:bg-purple-brand/90 disabled:cursor-not-allowed disabled:bg-purple-brand/40"
          >
            {isSubmitting ? "Processing..." : `Confirm Order (${total.toFixed(3)} KWD)`}
          </button>
        </form>
      </div>
      <aside className="mt-12 lg:mt-0">
        <CartSummary showCheckoutLink={false} />
      </aside>
    </div>
  );
}
