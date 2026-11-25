// Section ids and titles in one place, so the page, the nav and the
// command palette never disagree about what a section is called.
export const sections = {
  work: { id: "work", title: "Work" },
  experience: { id: "experience", title: "Experience" },
  about: { id: "about", title: "About" },
  skills: { id: "skills", title: "Skills" },
  education: { id: "education", title: "Education" },
  awards: { id: "awards", title: "Awards & activities" },
  contact: { id: "contact", title: "Contact" },
} as const;

export type SectionKey = keyof typeof sections;

/** Order of sections on the page (also the command palette's order). */
export const pageOrder: SectionKey[] = [
  "work",
  "experience",
  "about",
  "skills",
  "education",
  "awards",
  "contact",
];

/** Sections linked from the top navigation. */
export const navOrder: SectionKey[] = ["work", "experience", "about", "skills", "contact"];
