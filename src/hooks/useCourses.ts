import { useState, useEffect } from 'react';
import { Course } from '@/types';
import { reviewService } from '@/services/reviewService';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await reviewService.getCourses();
        setCourses(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        setError(err.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  return { courses, loading, error };
}; 