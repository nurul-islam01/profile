import type { Metadata, Viewport } from "next";
import { fontSans, fontSerif } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CommandPalette } from "@/components/command-palette";
import { Toaster } from "@/components/toaster";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Preloader } from "@/components/motion/preloader";
import { Cursor } from "@/components/motion/cursor";
import { pageMetadata, personJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = pageMetadata();

// Every visitor starts in the dark theme, so the browser chrome matches it.
export const viewport: Viewport = {
  themeColor: "#0F1626",
};

// Runs before first paint: marks JS as available, decides whether the loader
// shows (first visit in this tab, motion allowed, mouse-sized screen — phones
// go straight to the page), and guarantees content is revealed after 6s even
// if the app never boots.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||window.matchMedia('(pointer: coarse)').matches||window.innerWidth<768||sessionStorage.getItem('ni-seen')){d.classList.add('no-preload')}else{d.classList.add('is-loading')}}catch(e){d.classList.add('no-preload')}setTimeout(function(){if(d.dataset.ready!=='true'){d.classList.remove('is-loading');d.classList.add('no-preload');d.dataset.ready='true';window.dispatchEvent(new Event('app:ready'))}},6000)})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontSerif.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <a
            href="#main"
            className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100]"
          >
            Skip to content
          </a>
          <Preloader />
          <SmoothScroll />
          <Nav />
          <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
            {children}
          </main>
          <Footer />
          <CommandPalette />
          <Toaster />
          <Cursor />
        </ThemeProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
      </body>
    </html>
  );
}
