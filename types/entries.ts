export type TextEntry = {
  id: string;
  userId: string;
  title: string | null;
  content: string;
  mood: string | null;
  summary: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};
