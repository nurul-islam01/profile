export type Role = {
  /** short sha-like id for the git-log motif */
  id: string;
  title: string;
  company: string;
  location: string;
  start: string; // "Jul 2025"
  end: string;   // "Present"
  current?: boolean;
  highlights: string[];
  stack?: string[];
};

export const experience: Role[] = [
  {
    id: "a1b2c3d",
    title: "Deputy Manager & Tech Lead",
    company: "Navana Group",
    location: "Dhaka, Bangladesh",
    start: "Jul 2025",
    end: "Present",
    current: true,
    highlights: [
      "Lead the technology team responsible for web development and infrastructure across 10+ corporate sites including navana.com, navanarealestate.com, Gloria Jean's Coffees BD, La Tarte BD, Navana Logistics, Navana Furniture, Navana CNG, and Navana Engineering.",
      "Manage and maintain production Linux (AlmaLinux 8) VPS servers with cPanel/WHM.",
      "Architect and develop full stack web applications using Next.js (App Router), Node.js, and React for internal tools and customer-facing platforms.",
      "Set up CI/CD pipelines, systemd services, Apache reverse proxy configurations, and CSF firewall hardening.",
      "Drive engineering best practices, code reviews, and technical decision-making across the team.",
    ],
    stack: ["Next.js", "Node.js", "React", "AlmaLinux", "Apache", "cPanel/WHM", "CI/CD"],
  },
  {
    id: "e4f5g6h",
    title: "Web Developer",
    company: "Prothom Alo",
    location: "Karwan Bazar, Dhaka",
    start: "Jul 2021",
    end: "Jun 2025",
    highlights: [
      "Developed and maintained web products for Bangladesh's largest circulated newspaper using the Quintype/Bold CMS and Malibu framework.",
      "Built performant frontend experiences with React and Next.js, optimizing for SEO and Core Web Vitals on a platform serving 6.6M+ daily readers.",
      "Implemented SSR pipelines and custom Node.js services integrated with the Quintype API ecosystem.",
      "Delivered features including live blogs, story templates, collection pages, and subscription flows.",
      "Worked with GA4, Chartbeat, Google Publisher Tag, DFP, Cloudflare, AWS S3, and CDN integrations.",
      "Designed and prototyped UI in Figma; conducted regular code reviews ensuring high code quality.",
    ],
    stack: ["React", "Next.js", "Node.js", "Quintype/Bold", "Malibu", "Cloudflare", "AWS S3", "GA4"],
  },
  {
    id: "i7j8k9l",
    title: "Executive (Developer)",
    company: "Nassa Group",
    location: "Dhaka, Bangladesh",
    start: "Nov 2019",
    end: "Jun 2021",
    highlights: [
      "Developed 5+ Android apps (Java) and 4+ web applications using Angular, React, and Express.js.",
      "Contributed to ERP system development integrating HR, operations, and business management features.",
      "Designed and managed PostgreSQL schemas; deployed applications on Windows Server with IIS.",
      "Integrated REST APIs for seamless frontend-backend communication; ensured cross-platform compatibility.",
    ],
    stack: ["Angular", "React", "Express.js", "Java", "PostgreSQL", "IIS"],
  },
  {
    id: "m0n1o2p",
    title: "App Developer",
    company: "Wizdoor",
    location: "Mirpur, Dhaka",
    start: "Jun 2019",
    end: "Nov 2019",
    highlights: [
      "Developed Android applications (Java) and web interfaces using Angular, HTML, CSS, and JavaScript.",
      "Integrated REST APIs for seamless data communication; optimized UI performance for cross-device compatibility.",
    ],
    stack: ["Java", "Android", "Angular"],
  },
];
