export const profile = {
  name: "Nurul Islam",
  username: "nurul",
  role: "Deputy Manager & Full Stack Developer",
  shortRole: "Tech Lead",
  company: "Navana Group",
  location: "Dhaka, Bangladesh",
  email: "nurul.islam3f@gmail.com",
  phone: "+880 1727 946 384",
  headline: "Building scalable web platforms — currently leading engineering at Navana Group.",
  bio: `Full Stack Developer with 7+ years of experience building scalable web applications and leading engineering teams. Currently Deputy Manager & Tech Lead at Navana Group, overseeing development and infrastructure across multiple high-traffic web products. Deep expertise in React, Next.js, Node.js, and Go, with hands-on experience in Linux server administration, CI/CD pipelines, and enterprise CMS platforms (Quintype/Bold/Malibu). Recipient of the Prothom Alo Best Employee Award 2023.`,
  socials: {
    github: "https://github.com/nurul-islam01",
    linkedin: "https://linkedin.com/in/nurul-islam01",
    website: "https://nurul.com.bd",
    mirror: "https://nurul.dev",
  },
  resumeUrl: "/resume.pdf",
  photoUrl: "/me.jpg" as string | null,
  // Used for OG / structured data
  jobTitle: "Deputy Manager & Tech Lead",
  knowsAbout: [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Go",
    "Express.js", "NestJS", "GraphQL", "PostgreSQL", "MongoDB", "Redis",
    "Docker", "Kubernetes", "Linux", "Nginx", "Apache", "Cloudflare",
    "SEO", "Core Web Vitals", "SSR",
  ],
} as const;

export type Profile = typeof profile;
