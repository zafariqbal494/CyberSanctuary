import { useParams, useNavigate } from 'react-router-dom';
import { useCourseDetail } from '@/hooks/useCourseDetail';
import { useModals } from '@/hooks/useModals';
import { lazy, Suspense } from 'react';

// Import components
import CourseDetailLayout from '@/components/courses/CourseDetailLayout';
import { LoadingSkeletonView } from '@/components/courses/LoadingSkeletonView';
import { ErrorView } from '@/components/courses/ErrorView';

// Lazy load modal components
const PaymentModal = lazy(() => import('@/components/courses/PaymentModal'));
// Use named import for EnrollmentModal
const EnrollmentModalLazy = lazy(() => 
  import('@/components/courses/EnrollmentModal').then(module => ({
    default: module.EnrollmentModal
  }))
);

const CourseDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Use the course detail hook for data fetching and state management
  const {
    course,
    loading,
    error,
    isScrolled,
    userRating,
    setUserRating,
    newReview,
    setNewReview,
    isSubmitting
  } = useCourseDetail({ courseId: id });
  
  // Use the modals hook for managing modal states
  const { modals, openModal, closeModal } = useModals();
  
  // Handle review submission attempt
  const handleReviewSubmit = () => {
    if (!newReview.trim() && userRating === 0) return;
    
    // Show enrollment modal instead of submitting
    openModal('enrollment');
  };
  
  // Handle enrollment modal completion
  const handleEnroll = () => {
    closeModal('enrollment');
    openModal('payment');
  };

  // Loading state
  if (loading) {
    return <LoadingSkeletonView />;
  }

  // Error state
  if (error || !course) {
    return <ErrorView error={error} onBack={() => navigate('/courses')} />;
  }

  return (
    <>
      <CourseDetailLayout
        course={course}
        isScrolled={isScrolled}
        userRating={userRating}
        setUserRating={setUserRating}
        newReview={newReview}
        setNewReview={setNewReview}
        isSubmitting={isSubmitting}
        onReviewSubmit={handleReviewSubmit}
        onPaymentClick={() => openModal('payment')}
      >
        {/* Modals are included as children for better organization */}
        {modals.payment && (
          <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-neon-green/30 border-t-neon-green rounded-full animate-spin"></div>
          </div>}>
            <PaymentModal
              isOpen={modals.payment}
              onClose={() => closeModal('payment')}
              courseName={course.name}
              price={course.price}
              courseId={Number(course.id)}
            />
          </Suspense>
        )}
        
        {modals.enrollment && (
          <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-neon-green/30 border-t-neon-green rounded-full animate-spin"></div>
          </div>}>
            <EnrollmentModalLazy 
              isOpen={modals.enrollment}
              onClose={() => closeModal('enrollment')}
              onEnroll={handleEnroll}
              price={course.price}
            />
          </Suspense>
        )}
      </CourseDetailLayout>
    </>
  );
};

export default CourseDetail;