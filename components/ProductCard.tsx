"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Product } from "@/contexts/CartContext";
import { useCart } from "@/contexts/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const stockLabel = useMemo(() => {
    if (product.stock === null || product.stock === undefined) return "In stock";
    if (product.stock > 10) return "In stock";
    if (product.stock > 0) return `${product.stock} left`;
    return "Out of stock";
  }, [product.stock]);

  const isOutOfStock = (product.stock ?? 1) <= 0;

  return (
    <article className="overflow-hidden rounded-3xl border border-purple-brand/10 bg-white shadow-xl shadow-purple-brand/5">
      <div className="relative h-80 w-full bg-gradient-to-br from-purple-brand/5 via-white to-gold-brand/10">
        <Image
          src={product.image_url || "/mood-herbal-tea.svg"}
          alt={product.name}
          fill
          className="object-contain p-8"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="space-y-4 p-8">
        <header className="space-y-1">
          <p className="text-sm uppercase tracking-[0.35em] text-gold-brand">Signature Blend</p>
          <h2 className="font-display text-3xl font-semibold text-purple-brand">{product.name}</h2>
        </header>
        <p className="text-base text-purple-brand/80">{product.description}</p>
        {product.details && <p className="text-sm text-purple-brand/60">{product.details}</p>}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase text-purple-brand/50">Price</p>
            <p className="font-display text-3xl text-purple-brand">{product.price} KWD</p>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase text-purple-brand/50">Shipping</p>
            <p className="font-semibold text-purple-brand">{product.shipping_cost ?? 2} KWD</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-purple-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-brand">
            {stockLabel}
          </span>
          <button
            type="button"
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className="rounded-full bg-purple-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-brand/30 transition hover:-translate-y-0.5 hover:bg-purple-brand/90 disabled:cursor-not-allowed disabled:bg-purple-brand/40"
          >
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
