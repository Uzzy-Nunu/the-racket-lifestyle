import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-ink text-cream">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl">PLAY WELL.<br />LIVE WELL.</p>
          <p className="mt-4 max-w-sm text-sm text-cream/70">Gear and lifestyle essentials for people who take the game seriously.</p>
        </div>
        <div>
          <p className="eyebrow text-lime">Explore</p>
          <Link className="mt-3 block text-sm" href="/shop">Shop</Link>
          <Link className="mt-3 block text-sm" href="/shop?sport=tennis">Tennis</Link>
          <Link className="mt-3 block text-sm" href="/shop?sport=badminton">Badminton</Link>
          <Link className="mt-3 block text-sm" href="/shop?sport=padel">Padel</Link>
          <Link className="mt-3 block text-sm" href="/blog">Blog</Link>
        </div>
        <div>
          <p className="eyebrow text-lime">Need help?</p>
          <Link className="mt-3 block text-sm" href="/login">Your account</Link>
          <Link className="mt-3 block text-sm" href="/admin">Operations dashboard</Link>
          <Link className="mt-3 block text-sm" href="/contact">Contact us</Link>
          <p className="mt-5 text-sm text-cream/70">Nigeria-wide delivery with tracked courier updates.</p>
        </div>
      </div>
      <div className="border-t border-cream/15">
        <div className="page-shell flex flex-col justify-between gap-2 py-5 text-xs text-cream/55 sm:flex-row">
          <span>© 2026 The Racket Lifestyle</span>
          <span>Secure Paystack checkout</span>
        </div>
      </div>
    </footer>
  );
}
