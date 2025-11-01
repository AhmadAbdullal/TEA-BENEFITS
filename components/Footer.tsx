export default function Footer() {
  return (
    <footer className="border-t border-gold-brand/30 bg-purple-brand text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-2xl font-semibold tracking-wide">Sip wellness. Share joy.</p>
          <p className="text-sm text-gold-brand/80">
            © {new Date().getFullYear()} Tea & Benefits Store — crafted with love in Kuwait.
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <a href="mailto:teabenefitsstore@gmail.com" className="rounded-full border border-gold-brand px-4 py-2 transition-colors hover:bg-gold-brand hover:text-purple-brand">
            Contact
          </a>
          <a href="/admin" className="rounded-full border border-gold-brand px-4 py-2 transition-colors hover:bg-gold-brand hover:text-purple-brand">
            Admin Login
          </a>
        </div>
      </div>
    </footer>
  );
}
