"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { AdminProvider } from "@/contexts/AdminContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <CartProvider>{children}</CartProvider>
    </AdminProvider>
  );
}
