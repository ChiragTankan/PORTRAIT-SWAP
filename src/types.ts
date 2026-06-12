export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  generationPrompt: string;
  category: string;
  aspectRatio: "square" | "portrait" | "video";
  tags: string[];
  author: string;
  isCustom?: boolean;
}

export interface Bookmark {
  id: string;
  userId: string;
  promptId: string;
  createdAt: number;
}

export interface CustomPrompt {
  id: string;
  userId: string;
  title: string;
  imageUrl: string;
  generationPrompt: string;
  createdAt: number;
  category: string;
  tags: string[];
}
