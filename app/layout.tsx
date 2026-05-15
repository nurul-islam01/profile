import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { fontMono, fontSans } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CommandPalette } from "@/components/command-palette";
import { pageMetadata, personJsonLd, websiteJsonLd } from "@/lib/seo";
import { getAllPosts } from "@/lib/mdx";
import "./globals.css";

export const metadata: Metadata = pageMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const posts = (await getAllPosts()).map((p) => ({ slug: p.slug, title: p.title }));

  return (
    <html lang="en" suppressHydrationWarning className={`${fontMono.variable} ${fontSans.variable}`}>
      <body className="min-h-screen bg-terminal-bg text-terminal-fg antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Nav />
          <main>{children}</main>
          <Footer />
          <CommandPalette posts={posts} />
          <Toaster
            theme="system"
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast: "font-mono border border-terminal-border bg-terminal-surface text-terminal-fg",
              },
            }}
          />
        </ThemeProvider>

        {/* JSON-LD: Person + WebSite */}
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
