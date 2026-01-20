export interface List {
  listId: number;
  userId: number;
  name: string;
  description?: string;
  items: ListItem[];
  dateCreated: string;
}

export interface ListItem {
  animeId: number;
}

// Example Return from DB (user 10's lists):
// {
//   listId: 1,
//   userId: 10,
//   name: "Top Shonen",
//   description: "My must-watch action picks.",
//   items: [
//     { animeId: 3 },
//     { animeId: 11 },
//     { animeId: 6 },
//   ],
//   dateCreated: "January 20, 2026",
// },
// {
//   listId: 2,
//   userId: 10,
//   name: "Cozy Slice of Life",
//   description: "Comfort shows for easy evenings.",
//   items: [
//     { animeId: 4 },
//     { animeId: 9 },
//     { animeId: 6 },
//   ],
//   dateCreated: "December 2, 2025",
// }
