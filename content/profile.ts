export const profile = {
  name: "Nurul Islam",
  username: "nurul",
  role: "Deputy Manager & Tech Lead",
  shortRole: "Tech Lead",
  company: "Navana Group",
  location: "Dhaka, Bangladesh",
  timeZone: "Asia/Dhaka",
  email: "nurul.islam3f@gmail.com",
  phone: "+880 1727 946 384",
  headline: "Building scalable web platforms — currently leading engineering at Navana Group.",
  bio: `Full Stack Developer with 7+ years of experience building scalable web applications and leading engineering teams. Currently Deputy Manager & Tech Lead at Navana Group, overseeing web development and infrastructure across 10+ group company sites. Deep expertise in React, Next.js, Node.js, and Go, with hands-on experience in Linux server administration, CI/CD pipelines, and enterprise CMS platforms (Quintype/Bold/Malibu). Recipient of the Prothom Alo Best Employee Award 2023.`,
  socials: {
    github: "https://github.com/nurul-islam01",
    linkedin: "https://linkedin.com/in/nurul-islam01",
    website: "https://nurul.com.bd",
  },
  resumeUrl: "/resume.pdf",
  // 4:5 crop of me.jpg, served through next/image
  photoUrl: "/portrait.webp",
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
