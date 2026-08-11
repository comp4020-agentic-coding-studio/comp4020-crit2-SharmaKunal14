export interface Trip {
  name: string;
  date: string;
  grade: "Beginner" | "Intermediate" | "Advanced";
  activity: string;
  spots: string;
}

export const trips: Trip[] = [
  {
    name: "Booroomba Rocks day climb",
    date: "Sat 22 Aug",
    grade: "Beginner",
    activity: "Rock climbing",
    spots: "6 spots left",
  },
  {
    name: "Bimberi Wilderness overnight hike",
    date: "29–30 Aug",
    grade: "Intermediate",
    activity: "Bushwalking",
    spots: "Full — waitlist open",
  },
  {
    name: "Mount Buffalo top-rope weekend",
    date: "5–6 Sep",
    grade: "Beginner",
    activity: "Rock climbing",
    spots: "10 spots left",
  },
  {
    name: "Kosciuszko winter mountaineering intro",
    date: "12–13 Sep",
    grade: "Advanced",
    activity: "Mountaineering",
    spots: "3 spots left",
  },
  {
    name: "Booroomba Rocks night nav practice",
    date: "19 Sep",
    grade: "Intermediate",
    activity: "Navigation",
    spots: "8 spots left",
  },
];
