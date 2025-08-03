import { Review } from '@/types';
import { ReviewSection } from './reviews';

interface CourseReviewsProps {
  reviews: Review[] | undefined;
  onReviewSubmit: () => void;
  userRating: number;
  setUserRating: (rating: number) => void;
  newReview: string;
  setNewReview: (review: string) => void;
  isSubmitting: boolean;
}

export const CourseReviews = ({ 
  reviews, 
  onReviewSubmit, 
  userRating, 
  setUserRating, 
  newReview, 
  setNewReview,
  isSubmitting
}: CourseReviewsProps) => {
  return (
    <ReviewSection
      reviews={reviews}
      userRating={userRating}
      setUserRating={setUserRating}
      newReview={newReview}
      setNewReview={setNewReview}
      onReviewSubmit={onReviewSubmit}
      isSubmitting={isSubmitting}
    />
  );
}; 