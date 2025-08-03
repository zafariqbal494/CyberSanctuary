import { useParams } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import CourseFormModal from '@/components/admin/CourseFormModal';
import CourseModuleEditor from '@/components/admin/CourseModuleEditor';
import CourseDetailHeader from '@/components/admin/CourseDetailHeader';
import CourseModuleSaveControls from '@/components/admin/CourseModuleSaveControls';
import { useCourseEditor } from '@/hooks/useCourseEditor';
import { Module } from '@/types';

const EditCourse = () => {
  const { id = 'new' } = useParams<{ id: string }>();
  const isNewCourse = id === 'new';
  
  // Use the course editor hook for state management and API calls
  const {
    course,
    loading,
    error,
    saveStatus,
    isFormOpen,
    setIsFormOpen,
    handleSaveCourse,
    handleSaveModules
  } = useCourseEditor({
    courseId: id,
    isNewCourse
  });

  // Function for saving modules with their current editor instance
  const onSaveModules = (modules: Module[]) => {
    handleSaveModules(modules);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  
  if (error && !isNewCourse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-cyber-dark/50 rounded-lg border border-red-500/30">
          <p className="text-red-500 mb-4">Error: {error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header with course title and controls */}
      <CourseDetailHeader
        isNewCourse={isNewCourse}
        course={course}
        saveStatus={saveStatus}
        onEditDetails={() => setIsFormOpen(true)}
      />
      
      {/* Course content - only show for existing courses */}
      {!isNewCourse && (
        <div className="bg-cyber-dark p-6 rounded-lg border border-neon-green/20">
          {course && (
            <>
              <CourseModuleEditor
                courseId={course.id}
                initialModules={course.modules || []}
                onSave={onSaveModules}
              />
              
              <CourseModuleSaveControls
                saveStatus={saveStatus}
                onSave={() => {
                  // The module editor manages its own state, so we just pass
                  // the current modules to the save handler
                  if (course.modules) {
                    onSaveModules(course.modules);
                  }
                }}
              />
            </>
          )}
        </div>
      )}
      
      {/* Course Form Modal */}
      <CourseFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        course={isNewCourse ? null : course}
        onSave={handleSaveCourse}
      />
    </div>
  );
};

export default EditCourse; 