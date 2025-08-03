import { Course, Module } from '@/types';
import { getImageUrl } from '@/utils/imageUtils';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Course service for handling course-related API operations
export const courseService = {
  // Fetch all courses
  async fetchCourses(): Promise<Course[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      return await response.json();
    } catch (err) {
      console.error('Error fetching courses:', err);
      throw err;
    }
  },

  // Fetch a single course by ID
  async fetchCourse(id: string): Promise<Course> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }
      return await response.json();
    } catch (err) {
      console.error('Error fetching course:', err);
      throw err;
    }
  },

  // Create a new course
  async createCourse(courseData: Partial<Course> | FormData): Promise<Course> {
    try {
      // Check if courseData is FormData (file upload) or regular object
      const isFormData = courseData instanceof FormData;
      
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: isFormData ? {} : {
          'Content-Type': 'application/json',
        },
        body: isFormData ? courseData : JSON.stringify(courseData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText || 'Unknown error'}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error creating course:', err);
      throw err;
    }
  },

  // Update an existing course
  async updateCourse(id: string, courseData: Partial<Course> | FormData): Promise<Course> {
    try {
      // Check if courseData is FormData (file upload) or regular object
      const isFormData = courseData instanceof FormData;
      
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: isFormData ? 'POST' : 'PUT', // Use POST for FormData with _method=PUT
        headers: isFormData ? {} : {
          'Content-Type': 'application/json',
        },
        body: isFormData ? courseData : JSON.stringify(courseData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText || 'Unknown error'}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error updating course:', err);
      throw err;
    }
  },

  // Update course modules
  async updateCourseModules(courseId: string, modules: Module[]): Promise<Course> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modules),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText || 'Unknown error'}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error updating course modules:', err);
      throw err;
    }
  },

  // Delete a course
  async deleteCourse(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      throw err;
    }
  },
  
  // Update course purchases count
  async updatePurchasesCount(id: string, count: number): Promise<Course> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}/purchases-count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ purchases_count: count }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText || 'Unknown error'}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error updating purchases count:', err);
      throw err;
    }
  }
};

// Helper function for displaying course images
export const getCourseImageUrl = (url: string | undefined): string | null => {
  return getImageUrl(url);
}; 