import { useState, useEffect } from 'react';
import { Course } from '@/types';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

// Import custom components
import CoursePageHeader from '@/components/admin/CoursePageHeader';
import CourseSearchBar from '@/components/admin/CourseSearchBar';
import CourseListItem from '@/components/admin/CourseListItem';
import EmptyCoursesView from '@/components/admin/EmptyCoursesView';
import CourseListSkeleton from '@/components/admin/CourseListSkeleton';
import PurchasesCountModal from '@/components/admin/PurchasesCountModal';
import DeleteCourseDialog from '@/components/admin/DeleteCourseDialog';

// Import custom hooks and services
import { useDialog } from '@/hooks/useDialog';
import { courseService } from '@/services/courseService';
import useCourseSearch from '@/hooks/useCourseSearch';

const AdminCourses = () => {
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use the custom dialog hook for each modal/dialog
  const deleteDialog = useDialog<Course>();
  const purchasesCountModal = useDialog<Course>();
  
  // Use the custom search hook
  const { filteredCourses, searchTerm, setSearchTerm } = useCourseSearch(allCourses);
  
  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const courses = await courseService.fetchCourses();
      setAllCourses(courses);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch courses');
      toast({
        title: "Error",
        description: "Failed to fetch courses. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Navigate to create course page
  const handleOpenCreateForm = () => {
    navigate('/admin/courses/edit/new');
  };

  // Navigate to edit course page
  const handleOpenEditForm = (course: Course) => {
    navigate(`/admin/courses/edit/${course.id}`);
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (course: Course) => {
    deleteDialog.open(course);
  };

  // Delete a course
  const handleDeleteCourse = async () => {
    const course = deleteDialog.data;
    if (!course) return;
    
    try {
      await courseService.deleteCourse(course.id);
      
      // Remove from local state
      setAllCourses(prev => prev.filter(c => c.id !== course.id));
      
      toast({
        title: "Course Deleted",
        description: `${course.name} has been deleted.`
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course.",
        variant: "destructive"
      });
    } finally {
      deleteDialog.close();
    }
  };

  // Open purchases count modal
  const handleOpenPurchasesCountModal = (course: Course) => {
    purchasesCountModal.open(course);
  };

  // Update course purchases count
  const handleUpdatePurchasesCount = (updatedCourse: Course) => {
    // Update the course in the local state
    setAllCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
    purchasesCountModal.close();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <CoursePageHeader onCreateCourse={handleOpenCreateForm} />
      
      {/* Search Bar */}
      <CourseSearchBar 
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {/* Course List */}
      {loading ? (
        <CourseListSkeleton count={3} />
      ) : error ? (
        <div className="text-center py-12 bg-cyber-dark/50 rounded-lg border border-red-500/30">
          <p className="text-red-500">Error: {error}</p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <CourseListItem 
              key={course.id}
              course={course}
              onEdit={handleOpenEditForm}
              onDelete={handleOpenDeleteDialog}
              onUpdatePurchases={handleOpenPurchasesCountModal}
            />
          ))}
        </div>
      ) : (
        <EmptyCoursesView onClearSearch={() => setSearchTerm('')} />
      )}
      
      {/* Delete Confirmation Dialog */}
      <DeleteCourseDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDeleteCourse}
        course={deleteDialog.data}
      />
      
      {/* Purchases Count Modal */}
      {purchasesCountModal.data && (
        <PurchasesCountModal
          isOpen={purchasesCountModal.isOpen}
          onClose={purchasesCountModal.close}
          course={purchasesCountModal.data}
          onUpdate={handleUpdatePurchasesCount}
        />
      )}
    </div>
  );
};

export default AdminCourses; 