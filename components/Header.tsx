"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="border-b border-gold-brand/40 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Tea & Benefits logo" width={64} height={64} className="h-14 w-14" />
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gold-brand">Tea & Benefits</p>
            <p className="font-display text-2xl font-semibold text-purple-brand">Herbal Tea Boutique</p>
          </div>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-gold-brand transition-colors">
            Home
          </Link>
          <Link href="/cart" className="hover:text-gold-brand transition-colors">
            Cart
            {cartCount > 0 && (
              <span className="ml-2 rounded-full bg-purple-brand px-2 py-0.5 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/checkout" className="hover:text-gold-brand transition-colors">
            Checkout
          </Link>
          <Link href="/admin" className="rounded-full border border-gold-brand px-4 py-1.5 text-purple-brand transition-colors hover:bg-gold-brand hover:text-purple-brand">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
