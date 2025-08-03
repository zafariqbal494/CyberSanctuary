import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Course } from '@/types';
import { courseDetailService } from '@/services/courseDetailService';

interface UseCourseDetailProps {
  courseId: string;
}

export function useCourseDetail({ courseId }: UseCourseDetailProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  
  // Fetch course data
  const fetchCourse = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const courseData = await courseDetailService.fetchCourseWithDetails(courseId);
      setCourse(courseData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch course data when component mounts or id changes
  useEffect(() => {
    fetchCourse();
  }, [courseId]);
  
  // Handle scroll for sticky mobile payment button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return {
    course,
    loading,
    error,
    isScrolled,
    userRating,
    setUserRating,
    newReview,
    setNewReview,
    isSubmitting,
    setIsSubmitting,
    isMobile
  };
} 