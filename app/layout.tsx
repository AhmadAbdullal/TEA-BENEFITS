import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Tea & Benefits Store",
  description:
    "Tea & Benefits Store — premium herbal teas delivered with care. Shop our Mood Herbal Tea and more.",
  openGraph: {
    title: "Tea & Benefits Store",
    description:
      "Tea & Benefits Store — premium herbal teas delivered with care. Shop our Mood Herbal Tea and more.",
    type: "website",
    url: "https://tea-benefits-store.example",
    siteName: "Tea & Benefits Store"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-purple-brand">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
