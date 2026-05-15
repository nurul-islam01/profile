export type Education = {
  degree: string;
  institution: string;
  board?: string;
  year: string;
};

export const education: Education[] = [
  {
    degree: "Bachelor of Science in Computer Science & Engineering",
    institution: "Institute of Science and Technology, Dhanmondi",
    board: "National University",
    year: "2016",
  },
  {
    degree: "Higher Secondary Certificate (HSC) — Science",
    institution: "Altaxer Rahaman College, Bhola",
    board: "Board of Intermediate and Secondary Education, Barisal",
    year: "2012",
  },
  {
    degree: "Secondary School Certificate (SSC) — Science",
    institution: "Charjangalia Secondary School, Bhola",
    board: "Board of Intermediate and Secondary Education, Barisal",
    year: "2010",
  },
];
