export type SkillGroup = {
  name: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    name: "Expertise",
    items: [
      "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express.js",
      "GSAP", "Framer Motion", "Redux", "HTML5", "CSS3", "SCSS",
      "Tailwind CSS", "Bootstrap", "REST API", "Core Web Vitals", "SSR", "Responsive Design",
    ],
  },
  {
    name: "Backend",
    items: ["Go (Golang)", "Node.js", "Express.js", "GraphQL", "Microservices", "NestJS"],
  },
  {
    name: "Database & ORM",
    items: ["PostgreSQL", "MongoDB", "MySQL", "MariaDB", "Redis", "Elasticsearch", "Firebase", "Prisma"],
  },
  {
    name: "Mobile",
    items: ["Android Development (Java)", "React Native"],
  },
  {
    name: "DevOps",
    items: [
      "Docker", "Kubernetes", "GitHub CI/CD",
      "Linux (Ubuntu / AlmaLinux)", "cPanel/WHM",
      "Apache", "Nginx", "AWS S3", "Cloudflare",
    ],
  },
  {
    name: "Design",
    items: ["Figma", "Zeplin"],
  },
  {
    name: "Analytics & Tools",
    items: ["Git", "GitHub", "WebStorm", "VS Code", "GoLand", "Google Analytics GA4", "Chartbeat", "Google Tag Manager"],
  },
  {
    name: "CMS",
    items: ["Quintype / Bold CMS", "Malibu Framework", "Payload CMS", "Strapi"],
  },
];
