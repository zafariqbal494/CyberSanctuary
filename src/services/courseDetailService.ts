import { Course } from '@/types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Service for handling course detail related API calls
 */
export const courseDetailService = {
  /**
   * Fetch a course by ID with cache busting
   */
  async fetchCourse(id: string): Promise<Course> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}?_=${new Date().getTime()}`);
    
    if (!response.ok) {
      throw new Error('Course not found');
    }
    
    return await response.json();
  },
  
  /**
   * Fetch telegram link from settings
   */
  async fetchTelegramLink(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/settings/telegram-link`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch telegram link');
    }
    
    const data = await response.json();
    return data.telegramLink;
  },
  
  /**
   * Fetch course with additional data (telegram link if missing)
   */
  async fetchCourseWithDetails(id: string): Promise<Course> {
    const course = await this.fetchCourse(id);
    
    // Fetch telegram link if not provided in course data
    if (!course.telegramLink) {
      try {
        const telegramLink = await this.fetchTelegramLink();
        course.telegramLink = telegramLink;
      } catch (err) {
        console.error('Error fetching telegram link:', err);
        // Continue without telegram link if fetch fails
      }
    }
    
    return course;
  }
}; 