"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdmin } from "@/contexts/AdminContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAdmin();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "").trim();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setError(result.message ?? "Invalid credentials");
      return;
    }

    router.push("/admin/dashboard");
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <div className="space-y-6 rounded-3xl border border-purple-brand/15 bg-white p-10 shadow-xl shadow-purple-brand/10">
        <header className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-gold-brand">Admin</p>
          <h1 className="font-display text-3xl text-purple-brand">Tea &amp; Benefits Dashboard</h1>
          <p className="text-sm text-purple-brand/60">Enter the Supabase admin credentials to access orders and products.</p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-purple-brand">Email</span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-full border border-purple-brand/20 bg-purple-brand/5 px-4 py-3 text-purple-brand focus:border-purple-brand focus:outline-none"
              defaultValue="teabenefitsstore@gmail.com"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-purple-brand">Password</span>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-full border border-purple-brand/20 bg-purple-brand/5 px-4 py-3 text-purple-brand focus:border-purple-brand focus:outline-none"
            />
          </label>
          {error && <p className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-full bg-purple-brand px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-purple-brand/30 transition hover:-translate-y-0.5 hover:bg-purple-brand/90"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="text-center text-xs text-purple-brand/50">
          Need help? Email <Link href="mailto:teabenefitsstore@gmail.com" className="text-gold-brand">teabenefitsstore@gmail.com</Link>
        </div>
      </div>
    </div>
  );
}
