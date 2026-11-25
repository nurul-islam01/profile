import type { Metadata, Viewport } from "next";
import { fontSans, fontSerif } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CommandPalette } from "@/components/command-palette";
import { Toaster } from "@/components/toaster";
import { pageMetadata, personJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = pageMetadata();

// Every visitor starts in the dark theme, so the browser chrome matches it.
export const viewport: Viewport = {
  themeColor: "#0F1626",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontSerif.variable}`}>
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <a
            href="#main"
            className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[70]"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <CommandPalette />
          <Toaster />
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
