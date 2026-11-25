import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({ title: "Page not found" }),
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="page py-28 sm:py-36">
      <p className="tnum text-muted">404</p>
      <h1 className="mt-3 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
        Page not found
      </h1>
      <p className="mt-5 max-w-[40ch] font-serif text-xl text-muted">
        There is nothing at this address. The home page has everything on this site.
      </p>
      <Link href="/" className="btn btn-primary mt-9">
        Go to the home page
      </Link>
    </section>
  );
}
