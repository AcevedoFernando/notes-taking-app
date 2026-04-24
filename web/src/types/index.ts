export interface User {
  id: number;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  notes_count: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updated_at: string;
  category: string;
  category_name: string;
}
