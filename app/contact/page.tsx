import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell py-12">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Contact us</p>
            <h1 className="display mt-3 text-5xl">Let’s talk kit, delivery, and club needs.</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink/75">Whether you need product guidance, a bulk order, or help with your delivery timeline, our team is here to help.</p>
            <div className="mt-8 space-y-4 text-sm text-ink/70">
              <p>Email: hello@theracketlifestyle.com</p>
              <p>Phone: +234 800 123 4567</p>
              <p>Hours: Monday – Saturday, 9am – 6pm</p>
            </div>
          </div>
          <form className="rounded-[2rem] bg-chalk p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="rounded-xl border bg-cream px-4 py-3" placeholder="Full name" />
              <input className="rounded-xl border bg-cream px-4 py-3" placeholder="Email" />
            </div>
            <input className="mt-4 w-full rounded-xl border bg-cream px-4 py-3" placeholder="Subject" />
            <textarea className="mt-4 min-h-32 w-full rounded-xl border bg-cream px-4 py-3" placeholder="How can we help?" />
            <button className="mt-5 rounded-full bg-lime px-6 py-3 text-sm font-bold text-ink">Send message</button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
