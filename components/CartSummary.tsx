"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function CartSummary({ showCheckoutLink = true }: { showCheckoutLink?: boolean }) {
  const { items, removeFromCart, updateQuantity, calculateSubtotal, calculateTotal, deliveryFee } = useCart();

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-purple-brand/10 bg-white shadow-lg shadow-purple-brand/5">
        <div className="border-b border-purple-brand/10 bg-purple-brand/10 px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-purple-brand">Your Cart</h2>
        </div>
        <ul className="divide-y divide-purple-brand/10">
          {items.length === 0 && <li className="px-6 py-10 text-center text-purple-brand/60">Your cart is empty.</li>}
          {items.map((item) => (
            <li key={item.product.id} className="flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-display text-lg text-purple-brand">{item.product.name}</p>
                <p className="text-sm text-purple-brand/60">{item.product.price} KWD</p>
              </div>
              <div className="flex items-center gap-4">
                <label className="text-sm text-purple-brand/60" htmlFor={`quantity-${item.product.id}`}>
                  Qty
                </label>
                <input
                  id={`quantity-${item.product.id}`}
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) => {
                    const parsed = Number(event.target.value);
                    updateQuantity(item.product.id, Number.isFinite(parsed) ? parsed : 1);
                  }}
                  className="w-16 rounded-full border border-purple-brand/20 bg-purple-brand/5 px-3 py-1 text-center text-purple-brand focus:border-purple-brand focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-sm text-purple-brand/60 underline-offset-4 hover:text-gold-brand hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="space-y-4 border-t border-purple-brand/10 px-6 py-6">
          <div className="flex items-center justify-between text-sm text-purple-brand/70">
            <span>Subtotal</span>
            <span>{calculateSubtotal().toFixed(3)} KWD</span>
          </div>
          <div className="flex items-center justify-between text-sm text-purple-brand/70">
            <span>Delivery</span>
            <span>{deliveryFee.toFixed(3)} KWD</span>
          </div>
          <div className="flex items-center justify-between text-lg font-semibold text-purple-brand">
            <span>Total</span>
            <span>{calculateTotal().toFixed(3)} KWD</span>
          </div>
          {showCheckoutLink && items.length > 0 && (
            <Link
              href="/checkout"
              className="inline-flex w-full items-center justify-center rounded-full bg-purple-brand px-6 py-3 font-semibold text-white shadow-lg shadow-purple-brand/30 transition hover:-translate-y-0.5 hover:bg-purple-brand/90"
            >
              Proceed to Checkout
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
