import { useState, useEffect } from 'react';
import { Course } from '@/types';

interface UseCourseSearchResult {
  filteredCourses: Course[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

/**
 * Custom hook for searching and filtering courses
 * @param courses - The list of all courses to filter from
 * @returns Object containing filtered courses, search term, and setSearchTerm function
 */
export const useCourseSearch = (courses: Course[]): UseCourseSearchResult => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);

  // Filter courses when search term or course list changes
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    
    if (!searchTerm.trim()) {
      // If search term is empty, return all courses
      setFilteredCourses(courses);
      return;
    }
    
    // Filter courses based on search term
    const filtered = courses.filter(course => {
      return (
        course.name.toLowerCase().includes(lowercasedSearchTerm) ||
        (course.shortDescription && 
         course.shortDescription.toLowerCase().includes(lowercasedSearchTerm))
      );
    });
    
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  return {
    filteredCourses,
    searchTerm,
    setSearchTerm,
  };
};

export default useCourseSearch; 