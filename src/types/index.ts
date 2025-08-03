export interface Lesson {
  id: number;
  title: string;
  durationMinutes: number;
  type: string;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  durationMinutes: number;
  lessons: Lesson[];
}

export interface Review {
  id: number;
  user_name: string;
  user_avatar?: string;
  rating: number;
  content: string;
  created_at: string;
  marked_helpful: boolean;
  helpful_count: number;
}

export interface Course {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  image_url?: string;
  duration: string;
  topics?: string[];
  specifications?: string[];
  price: number;
  lastUpdate: string;
  purchases_count?: number;
  telegramLink?: string;
  modules?: Module[];
  faqs?: {
    title: string;
    content: string;
  }[];
  reviews?: Review[];
} 