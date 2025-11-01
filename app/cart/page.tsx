"use client";

import Link from "next/link";
import CartSummary from "@/components/CartSummary";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const { items } = useCart();

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-16">
      <header className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-gold-brand">Your selection</p>
        <h1 className="font-display text-4xl text-purple-brand">Cart</h1>
      </header>
      <CartSummary />
      {items.length === 0 ? (
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-purple-brand px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-purple-brand/30 transition hover:-translate-y-0.5 hover:bg-purple-brand/90"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="text-center text-sm text-purple-brand/60">
          Delivery fee of 2 KWD is applied to every order within Kuwait.
        </div>
      )}
    </div>
  );
}
