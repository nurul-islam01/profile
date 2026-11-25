import localFont from "next/font/local";

// Self-hosted (OFL) so the site never calls Google Fonts at runtime or build time.
// Schibsted Grotesk was drawn for a news-media group — it carries names, domains and UI.
export const fontSans = localFont({
  src: "../app/fonts/schibsted-grotesk-latin-wght-normal.woff2",
  variable: "--font-sans",
  weight: "400 900",
  display: "swap",
});

// Newsreader is a screen serif made for long-form news reading — used only for reading text.
export const fontSerif = localFont({
  src: "../app/fonts/newsreader-latin-opsz-normal.woff2",
  variable: "--font-serif",
  weight: "200 800",
  display: "swap",
});
