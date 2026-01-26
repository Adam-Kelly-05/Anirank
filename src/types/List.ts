export interface List {
  listId: number;
  userId: string;
  name: string;
  description?: string;
  items: number[];
  dateCreated: string;
}

// Example Return from DB (user 10's lists):
// {
//   {
//     "listId": 2,
//     "items": [
//       339,
//       39195,
//       57334
//     ],
//     "userId": "32d5a424-50d1-70c0-1029-0c47db40e02d",
//     "dateCreated": "January 21, 2026",
//     "name": "Watched Together",
//     "description": "This is all the anime I watched with someone else"
//   },
//   {
//     "listId": 1,
//     "items": [
//       1535,
//       22319,
//       38691
//     ],
//     "userId": "32d5a424-50d1-70c0-1029-0c47db40e02d",
//     "description": "This is all the anime I first watched years ago",
//     "name": "First Watched Anime",
//     "dateCreated": "January 20, 2026"
//   }
// }
