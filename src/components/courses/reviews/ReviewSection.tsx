import { Review } from '@/types';
import { ReviewStats } from './ReviewStats';
import { ReviewForm } from './ReviewForm';
import { ReviewsList } from './ReviewsList';

interface ReviewSectionProps {
  reviews: Review[] | undefined;
  userRating: number;
  setUserRating: (rating: number) => void;
  newReview: string;
  setNewReview: (review: string) => void;
  onReviewSubmit: () => void;
  isSubmitting: boolean;
}

export const ReviewSection = ({
  reviews,
  userRating,
  setUserRating,
  newReview,
  setNewReview,
  onReviewSubmit,
  isSubmitting
}: ReviewSectionProps) => {
  return (
    <div className="mt-4 md:mt-10">
      <div className="mb-3 sm:mb-4 bg-cyber-darker p-3 sm:p-4 rounded-lg border border-neon-green/20 shadow-md relative overflow-hidden">
        <div className="relative">
          {/* Rating Statistics Section */}
          <ReviewStats reviews={reviews} />
          
          {/* Review Submission Form */}
          <ReviewForm 
            userRating={userRating}
            setUserRating={setUserRating}
            newReview={newReview}
            setNewReview={setNewReview}
            onSubmit={onReviewSubmit}
            isSubmitting={isSubmitting}
          />

          {/* Reviews List Section */}
          <ReviewsList 
            reviews={reviews} 
            onHelpfulClick={onReviewSubmit} 
          />
        </div>
      </div>
    </div>
  );
}; 