import { Course, Module } from '@/types';

/**
 * Parse and validate curriculum data from course
 */
export const getCurriculumData = (course: Course): { useEnhanced: boolean; modules: Module[] } => {
  // If we have enhanced curriculum data, use it
  if (course.modules && course.modules.length > 0) {
    return {
      useEnhanced: true,
      modules: course.modules
    };
  }
  
  // If we have FAQ data, use it as fallback
  if (course.faqs && course.faqs.length > 0) {
    return {
      useEnhanced: false,
      modules: course.faqs.map(faq => ({
        id: 0, // Placeholder
        title: faq.title,
        description: faq.content,
        durationMinutes: 0, // Placeholder
        lessons: [] // Placeholder
      }))
    };
  }
  
  // If neither is available, create sample modules based on topics
  return {
    useEnhanced: false,
    modules: course.topics && course.topics.length > 0 ? course.topics.map((topic, index) => ({
      id: index, // Placeholder
      title: `Module ${index + 1}: ${topic}`,
      description: `This module covers all aspects of ${topic} with practical examples.`,
      durationMinutes: 0, // Placeholder
      lessons: [] // Placeholder
    })) : [
      {
        id: 1,
        title: "Introduction to the Course",
        description: "Get started with the course fundamentals.",
        durationMinutes: 60,
        lessons: []
      }
    ]
  };
};

/**
 * Format date for reviews
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  // Check if it's today
  if (date.toDateString() === now.toDateString()) {
    return 'Today';
  }
  
  // Check if it's yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  // Return formatted date
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}; 