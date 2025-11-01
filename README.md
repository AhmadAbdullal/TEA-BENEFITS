# Tea & Benefits Store

A full-stack Next.js storefront for Tea & Benefits Store featuring Supabase-powered product management, order intake, and an admin dashboard.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.local.example` to `.env.local` (or create `.env.local`) and add the Supabase credentials provided by the client:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Visit [http://localhost:3000](http://localhost:3000) to view the storefront.

## Available scripts

- `npm run dev` – start the development server
- `npm run build` – create a production build
- `npm run start` – serve the production build
- `npm run lint` – run ESLint using the Next.js configuration

## Tech stack

- [Next.js 14 (App Router)](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) for database, storage, and authentication
- Context API for client-side cart and admin session state

## Project structure

```
app/                # App Router pages and layouts
components/         # Reusable UI components
contexts/           # React context providers (cart, admin)
lib/                # Supabase helpers and data utilities
public/             # Static assets (logo, product illustrations)
```

## Admin access

- Navigate to `/admin` to sign in using the Supabase admin credentials.
- The dashboard (`/admin/dashboard`) allows you to view orders, update statuses, add/edit/delete products, and upload new product images directly to Supabase Storage.

## Notes

- Checkout captures customer details and records orders in the `الطلبات` table. Delivery fees default to 2 KWD.
- Payment integration is stubbed and can be connected via the placeholder section in `app/checkout/page.tsx`.
- Product images uploaded through the dashboard are stored in the public Supabase bucket `انواع الشاي`.
