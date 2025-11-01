import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <div className="space-y-6 rounded-3xl border border-gold-brand/50 bg-white p-12 shadow-xl shadow-purple-brand/10">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-gold-brand bg-purple-brand/10">
          <span className="text-5xl">✅</span>
        </div>
        <h1 className="font-display text-4xl text-purple-brand">Your order is confirmed!</h1>
        <p className="text-lg text-purple-brand/70">
          Thank you for choosing Tea &amp; Benefits Store. A member of our team will review your order and contact you to arrange
          delivery and payment details.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-purple-brand px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-purple-brand/30 transition hover:-translate-y-0.5 hover:bg-purple-brand/90"
          >
            Back to Home
          </Link>
          <Link
            href="/cart"
            className="rounded-full border border-gold-brand px-8 py-3 text-sm font-semibold uppercase tracking-wide text-purple-brand transition hover:bg-gold-brand/20"
          >
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
