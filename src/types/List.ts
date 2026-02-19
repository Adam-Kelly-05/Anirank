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
