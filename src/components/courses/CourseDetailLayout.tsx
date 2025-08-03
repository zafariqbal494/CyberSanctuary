import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Course } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { getCurriculumData } from '@/utils/courseUtils';
import { Suspense, lazy } from 'react';

// Import components
import { CourseHeader } from './CourseHeader';
import { CourseDescription } from './CourseDescription';
import { CoursePaymentCard } from './CoursePaymentCard';
import { CourseReviews } from './CourseReviews';
import { MobilePaymentButton } from './MobilePaymentButton';

// Lazy load the CourseCurriculum component
const LazyCourseCurriculum = lazy(() => import('./curriculum/CourseCurriculum'));

interface CourseDetailLayoutProps {
  course: Course;
  isScrolled: boolean;
  userRating: number;
  setUserRating: (rating: number) => void;
  newReview: string;
  setNewReview: (review: string) => void;
  isSubmitting: boolean;
  onReviewSubmit: () => void;
  onPaymentClick: () => void;
  children?: React.ReactNode; // For modals or other elements
}

const CourseDetailLayout = ({
  course,
  isScrolled,
  userRating,
  setUserRating,
  newReview,
  setNewReview,
  isSubmitting,
  onReviewSubmit,
  onPaymentClick,
  children
}: CourseDetailLayoutProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Get curriculum data
  const curriculumData = getCurriculumData(course);

  return (
    <div className="container mx-auto px-4 py-1 pb-24 md:pb-12">
      <Button 
        variant="ghost" 
        className="mb-1 md:mb-5 py-0.5 px-1 md:py-2 md:px-4 text-white/70 hover:text-white hover:bg-cyber-light text-xs md:text-sm"
        onClick={() => navigate('/courses')}
      >
        <ArrowLeft className="mr-1 h-3 w-3 md:h-3.5 md:w-3.5" />
        Back to courses
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <CourseHeader course={course} />
          
          {/* Mobile Payment Summary */}
          {isMobile && (
            <CoursePaymentCard 
              course={course}
              isMobile={true}
              onPaymentClick={onPaymentClick}
            />
          )}
          
          <CourseDescription course={course} />
          
          <Suspense fallback={
            <div className="mt-4 md:mt-8 mb-3 md:mb-8 bg-cyber-darker relative p-6 rounded-xl border border-neon-green/30 flex justify-center">
              <div className="w-8 h-8 border-2 border-neon-green/30 border-t-neon-green rounded-full animate-spin"></div>
            </div>
          }>
            <LazyCourseCurriculum 
              modules={curriculumData.modules}
              useEnhanced={curriculumData.useEnhanced}
              telegramLink={course.telegramLink}
            />
          </Suspense>
        </div>
        
        {/* Desktop Payment Card */}
        {!isMobile && (
          <CoursePaymentCard 
            course={course}
            isMobile={false}
            onPaymentClick={onPaymentClick}
          />
        )}
      </div>
      
      {/* Reviews Section */}
      <CourseReviews 
        reviews={course.reviews}
        onReviewSubmit={onReviewSubmit}
        userRating={userRating}
        setUserRating={setUserRating}
        newReview={newReview}
        setNewReview={setNewReview}
        isSubmitting={isSubmitting}
      />
      
      {/* Sticky payment button for mobile */}
      {isMobile && (
        <MobilePaymentButton 
          isScrolled={isScrolled}
          price={course.price}
          onPaymentClick={onPaymentClick}
        />
      )}
      
      {/* Render children (modals, etc.) */}
      {children}
    </div>
  );
};

export default CourseDetailLayout; 