import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckoutForm } from "@/components/checkout-form";
export default function CheckoutPage() { return <><SiteHeader/><main className="page-shell py-12"><p className="eyebrow">Checkout</p><h1 className="display mt-2 text-5xl">A good match starts here.</h1><p className="mt-3">Secure Paystack checkout. A real delivery estimate for your address. No surprises at the door.</p><div className="mt-10"><CheckoutForm/></div></main><SiteFooter/></>; }
