import type { Metadata } from "next";
import { profile } from "@/content/profile";

export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nurul.com.bd",
  name: `${profile.name} — ${profile.jobTitle}`,
  shortName: profile.name,
  description: profile.bio,
  // Set to your real handle (e.g. "@nurul_islam01") once verified, otherwise leave undefined
  // so Twitter doesn't show a broken creator link in cards.
  twitter: undefined as string | undefined,
  locale: "en_US",
  // Search-console verification tokens — fill in after registering each property.
  verification: {
    google: undefined as string | undefined, // Google Search Console TXT/meta value
    bing: undefined as string | undefined,   // Bing Webmaster Tools meta value
  },
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}

type PageMetaInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
};

export function pageMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  publishedTime,
}: PageMetaInput = {}): Metadata {
  const fullTitle = title ? `${title} · ${profile.name}` : siteConfig.name;
  const desc = description ?? siteConfig.description;
  const url = absoluteUrl(path);
  // When `image` is omitted, omit the images array entirely so Next.js can
  // auto-attach the route's `opengraph-image.tsx` output.
  const explicitImages = image
    ? [{ url: image, width: 1200, height: 630, alt: fullTitle }]
    : undefined;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description: desc,
      siteName: profile.name,
      locale: siteConfig.locale,
      ...(explicitImages ? { images: explicitImages } : {}),
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      ...(siteConfig.twitter ? { creator: siteConfig.twitter } : {}),
      ...(image ? { images: [image] } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...(siteConfig.verification.google || siteConfig.verification.bing
      ? {
          verification: {
            ...(siteConfig.verification.google ? { google: siteConfig.verification.google } : {}),
            ...(siteConfig.verification.bing ? { other: { "msvalidate.01": siteConfig.verification.bing } } : {}),
          },
        }
      : {}),
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.jobTitle,
    worksFor: {
      "@type": "Organization",
      name: profile.company,
    },
    url: siteConfig.url,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    sameAs: [
      profile.socials.github,
      profile.socials.linkedin,
      profile.socials.mirror,
    ],
    knowsAbout: [...profile.knowsAbout],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Institute of Science and Technology, Dhanmondi (National University)",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.name,
    url: siteConfig.url,
    inLanguage: "en",
  };
}
