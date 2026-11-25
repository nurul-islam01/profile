export type Project = {
  slug: string;
  name: string;
  tagline: string;
  url: string;
  org: "Navana Group" | "Prothom Alo" | "Personal";
  role: string;
  stack: string[];
  featured?: boolean;
  /** First screen of the live site: 1496×801 webp in /public/work. */
  image?: string;
  /**
   * Sites shown as a typographic card instead of a screenshot (the news sites,
   * whose first screens are full of photos of people). Colours are taken from
   * each site's own header and logo.
   */
  brand?: { bg: string; fg: string; accent: string };
};

export const projects: Project[] = [
  {
    slug: "navana",
    name: "Navana Group",
    tagline: "Corporate site for one of Bangladesh's largest conglomerates.",
    url: "https://navana.com",
    org: "Navana Group",
    role: "Tech Lead — architecture, build, infra",
    stack: ["Next.js", "Node.js", "MySQL", "MariaDB", "PostgreSQL", "AlmaLinux", "Apache"],
    featured: true,
    image: "/work/navana.webp",
  },
  {
    slug: "navana-real-estate",
    name: "Navana Real Estate",
    tagline: "Property portfolio and project showcase.",
    url: "https://navanarealestate.com",
    org: "Navana Group",
    role: "Tech Lead",
    stack: ["Next.js", "Node.js", "MySQL", "MariaDB", "PostgreSQL"],
    featured: true,
    image: "/work/navana-real-estate.webp",
  },
  {
    slug: "gloria-jeans-bd",
    name: "Gloria Jean's Coffees BD",
    tagline: "Bangladesh franchise site for the global coffee brand.",
    url: "https://gloriajeanscoffeesbd.com",
    org: "Navana Group",
    role: "Tech Lead",
    stack: ["Next.js", "Tailwind", "MySQL", "MariaDB", "PostgreSQL"],
    featured: true,
    image: "/work/gloria-jeans-bd.webp",
  },
  {
    slug: "la-tarte-bd",
    name: "La Tarte BD",
    tagline: "Premium patisserie brand site.",
    url: "https://latartebd.com",
    org: "Navana Group",
    role: "Tech Lead",
    stack: ["Next.js", "Tailwind", "MySQL", "MariaDB", "PostgreSQL"],
    image: "/work/la-tarte-bd.webp",
  },
  {
    slug: "navana-logistics",
    name: "Navana Logistics",
    tagline: "End-to-end logistics solutions for Bangladesh.",
    url: "https://navana-logistics.com",
    org: "Navana Group",
    role: "Tech Lead",
    stack: ["Next.js", "MySQL", "MariaDB", "PostgreSQL"],
    image: "/work/navana-logistics.webp",
  },
  {
    slug: "navana-furniture",
    name: "Navana Furniture",
    tagline: "Furniture catalog and brand presence.",
    url: "https://navanafurniture.com",
    org: "Navana Group",
    role: "Tech Lead",
    stack: ["Next.js", "NestJS", "Prisma", "PostgreSQL"],
    image: "/work/navana-furniture.webp",
  },
  {
    slug: "navana-cng",
    name: "Navana CNG",
    tagline: "CNG conversion and refueling services site.",
    url: "https://navanacng.com",
    org: "Navana Group",
    role: "Tech Lead",
    stack: ["Next.js", "MySQL", "MariaDB", "PostgreSQL"],
    image: "/work/navana-cng.webp",
  },
  {
    slug: "navana-engineering",
    name: "Navana Engineering",
    tagline: "Engineering services brand site.",
    url: "https://navanaengineering.com",
    org: "Navana Group",
    role: "Tech Lead",
    stack: ["Next.js", "MySQL", "MariaDB", "PostgreSQL"],
    image: "/work/navana-engineering.webp",
  },
  {
    slug: "prothom-alo",
    name: "Prothom Alo",
    tagline: "Bangladesh's most-read daily — 10M+ monthly online users.",
    url: "https://www.prothomalo.com",
    org: "Prothom Alo",
    role: "Software Engineer (2021–2025)",
    stack: ["React", "Next.js", "Quintype/Bold", "Malibu", "PostgreSQL", "Redis", "Elasticsearch", "Cloudflare"],
    featured: true,
    brand: { bg: "#FFFFFF", fg: "#141414", accent: "#E84D22" },
  },
  {
    slug: "kishor-alo",
    name: "Kishor Alo",
    tagline: "Children's & teens magazine — flagship of Prothom Alo's youth media.",
    url: "https://www.kishoralo.com",
    org: "Prothom Alo",
    role: "Software Engineer (2021–2025)",
    stack: ["React", "Next.js", "Quintype/Bold", "Malibu", "Cloudflare"],
    featured: true,
    brand: { bg: "#F5C001", fg: "#1B1B1B", accent: "#EA5024" },
  },
  {
    slug: "biggan-chinta",
    name: "Biggan Chinta",
    tagline: "Bangladesh's leading popular-science magazine.",
    url: "https://www.bigganchinta.com",
    org: "Prothom Alo",
    role: "Software Engineer (2021–2025)",
    stack: ["React", "Next.js", "Quintype/Bold", "Malibu", "Cloudflare"],
    featured: true,
    brand: { bg: "#3681BC", fg: "#FFFFFF", accent: "#CE573F" },
  },
  {
    slug: "bondhushava",
    name: "Bondhushava",
    tagline: "Community platform & friendship-circle magazine of Prothom Alo.",
    url: "https://www.bondhushava.com",
    org: "Prothom Alo",
    role: "Software Engineer (2021–2025)",
    stack: ["React", "Next.js", "Quintype/Bold", "Malibu", "Cloudflare"],
    featured: true,
    brand: { bg: "#83438D", fg: "#FFFFFF", accent: "#59B1DF" },
  },
  {
    slug: "prothom-alo-trust",
    name: "Prothom Alo Trust",
    tagline: "Humanitarian arm of Prothom Alo — campaigns and relief programs.",
    url: "https://trust.prothomalo.com",
    org: "Prothom Alo",
    role: "Software Engineer (2021–2025)",
    stack: ["React", "Next.js", "Quintype/Bold", "Cloudflare"],
    brand: { bg: "#E54D23", fg: "#FFFFFF", accent: "#2B2B2B" },
  },
  {
    slug: "nagorik-songbad",
    name: "Nagorik Songbad",
    tagline: "Citizen journalism platform powered by Prothom Alo.",
    url: "https://nagorik.prothomalo.com",
    org: "Prothom Alo",
    role: "Software Engineer (2021–2025)",
    stack: ["React", "Next.js", "Quintype/Bold", "Cloudflare"],
    brand: { bg: "#5DB9B5", fg: "#0E2B2A", accent: "#FFFFFF" },
  },
  {
    slug: "chironton-71",
    name: "Chironton 71",
    tagline: "1971 Liberation War archive and resource hub.",
    url: "https://1971.prothomalo.com",
    org: "Prothom Alo",
    role: "Software Engineer (2021–2025)",
    stack: ["React", "Next.js", "Quintype/Bold", "Cloudflare"],
    brand: { bg: "#2B2B2B", fg: "#F4EFE6", accent: "#BF4531" },
  },
];
