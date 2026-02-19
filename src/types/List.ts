export interface List {
  listId: string;
  listName: string;
  createdAt: string;
  items: ListItem[];
  userId?: string;
}

export interface ListItem {
  animeId: number;
  addedAt: string;
}

export interface UserList {
  listId: number;
  userId: string;
  name: string;
  items: number[];
  dateCreated: string;
}
