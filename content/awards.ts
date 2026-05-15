export type Award = {
  title: string;
  year?: string;
  org?: string;
  highlight?: boolean;
};

export const awards: Award[] = [
  {
    title: "Prothom Alo Best Employee Award",
    year: "2023",
    org: "Prothom Alo",
    highlight: true,
  },
  {
    title: "Member, University Computer Programming Club (PcIST)",
    org: "Institute of Science and Technology",
  },
  {
    title: "NASA Space Apps Challenge 2014",
    year: "2014",
  },
  {
    title: "Fire Fighting, Fire Prevention, Rescue and First Aid Training",
    org: "Fire Service & Civil Defence Directorate",
  },
];
