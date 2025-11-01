import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <div className="bg-gradient-to-b from-white via-purple-brand/5 to-white">
      <section className="relative overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-16 pt-20 md:flex-row md:items-center">
          <div className="md:w-1/2">
            <span className="inline-block rounded-full border border-gold-brand px-4 py-1 text-sm uppercase tracking-[0.35em] text-gold-brand">
              Herbal Wellness
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold text-purple-brand md:text-6xl">
              Mood Herbal Tea
            </h1>
            <p className="mt-4 text-lg text-purple-brand/80">
              Crafted with Chinese-style botanicals to balance your day and elevate your mood.
              Brew a cup of positivity with every order from Tea &amp; Benefits Store.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="#products"
                className="rounded-full bg-purple-brand px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-purple-brand/30 transition hover:-translate-y-0.5 hover:bg-purple-brand/90"
              >
                Shop Now
              </Link>
              <Link
                href="/cart"
                className="rounded-full border border-gold-brand px-8 py-3 text-sm font-semibold uppercase tracking-wide text-purple-brand transition hover:bg-gold-brand/20"
              >
                View Cart
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative mx-auto flex max-w-lg items-center justify-center rounded-[3rem] border border-gold-brand/60 bg-white p-6 shadow-2xl">
              <div className="absolute inset-x-6 bottom-6 top-6 rounded-[2.5rem] border border-purple-brand/20" />
              <img src="/mood-herbal-tea.svg" alt="Mood Herbal Tea" className="relative z-10 w-full" />
            </div>
          </div>
        </div>
      </section>
      <section id="products" className="mx-auto max-w-6xl space-y-12 px-6 pb-24">
        <header className="text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-gold-brand">Tea Selection</p>
          <h2 className="mt-4 font-display text-4xl text-purple-brand">Discover the benefits in every blend</h2>
        </header>
        {products.length === 0 ? (
          <div className="rounded-3xl border border-purple-brand/10 bg-white p-12 text-center text-purple-brand/70 shadow">
            No products are available at the moment. Please check back soon.
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
