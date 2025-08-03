import { useState, useEffect } from 'react';
import { Course, Module } from '@/types';
import { courseService } from '@/services/courseService';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseCourseEditorProps {
  courseId: string;
  isNewCourse: boolean;
}

export const useCourseEditor = ({ courseId, isNewCourse }: UseCourseEditorProps) => {
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(!isNewCourse);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isFormOpen, setIsFormOpen] = useState(isNewCourse);

  // Fetch course data if it's an existing course
  useEffect(() => {
    if (isNewCourse) return;
    
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await courseService.fetchCourse(courseId);
        setCourse(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId, isNewCourse]);

  // Handle saving course details
  const handleSaveCourse = async (courseData: Partial<Course> | FormData) => {
    try {
      setSaveStatus('saving');
      
      let savedCourse: Course;
      
      if (isNewCourse) {
        // Create new course
        savedCourse = await courseService.createCourse(courseData);
        toast({
          title: "Course Created",
          description: `${courseData instanceof FormData ? courseData.get('name') : courseData.name} has been created successfully.`
        });
        
        // Redirect to edit page with the new ID
        navigate(`/admin/courses/edit/${savedCourse.id}`, { replace: true });
      } else {
        // Update existing course
        savedCourse = await courseService.updateCourse(courseId, courseData);
        toast({
          title: "Course Updated",
          description: `${courseData instanceof FormData ? courseData.get('name') : courseData.name} has been updated successfully.`
        });
      }
      
      setCourse(savedCourse);
      setIsFormOpen(false);
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: `Failed to ${isNewCourse ? 'create' : 'update'} course.`,
        variant: "destructive"
      });
      setSaveStatus('error');
    }
  };

  // Handle saving course modules
  const handleSaveModules = async (modules: Module[]) => {
    if (!course) return;
    
    try {
      setSaveStatus('saving');
      
      const updatedCourse = await courseService.updateCourseModules(course.id, modules);
      setCourse(updatedCourse);
      setSaveStatus('saved');
      
      toast({
        title: "Curriculum Saved",
        description: "Course curriculum has been updated successfully."
      });
    } catch (error: any) {
      console.error('Error saving modules:', error);
      toast({
        title: "Error",
        description: `Failed to save curriculum. ${error.message || ''}`,
        variant: "destructive"
      });
      setSaveStatus('error');
    }
  };

  return {
    course,
    loading,
    error,
    saveStatus,
    isFormOpen,
    setIsFormOpen,
    handleSaveCourse,
    handleSaveModules
  };
}; 