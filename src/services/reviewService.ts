import { Review, Course } from '@/types';

// Define the API base URL - should be moved to environment config
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface ReviewFilters {
  search?: string;
  courseId?: string;
  rating?: string;
  sortBy?: 'created_at' | 'rating' | 'helpful_count';
  sortOrder?: 'asc' | 'desc';
  page?: number;
}

export interface NewReview {
  course_id: string;
  user_name: string;
  rating: number;
  content: string;
  helpful_count: number;
  created_at: string;
}

export const reviewService = {
  async getReviews(filters: ReviewFilters): Promise<PaginatedResponse<Review>> {
    const { search, courseId, rating, sortBy = 'created_at', sortOrder = 'desc', page = 1 } = filters;
    
    let url = `${API_BASE_URL}/reviews?page=${page}`;
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    if (courseId && courseId !== 'all') {
      url += `&course_id=${courseId}`;
    }
    
    if (rating && rating !== 'all') {
      url += `&rating=${rating}`;
    }
    
    url += `&sort_by=${sortBy}&sort_order=${sortOrder}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  async getCourses(): Promise<Course[]> {
    const response = await fetch(`${API_BASE_URL}/reviews/courses`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  async createReview(reviewData: NewReview): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/admin/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(reviewData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create review');
    }
    
    const data = await response.json();
    return data.review;
  },
  
  async deleteReview(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }
}; 