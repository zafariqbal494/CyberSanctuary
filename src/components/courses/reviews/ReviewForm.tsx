import { Send } from 'lucide-react';
import StarRating from '@/components/courses/StarRating';

interface ReviewFormProps {
  userRating: number;
  setUserRating: (rating: number) => void;
  newReview: string;
  setNewReview: (review: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ReviewForm = ({ 
  userRating, 
  setUserRating, 
  newReview, 
  setNewReview, 
  onSubmit, 
  isSubmitting 
}: ReviewFormProps) => {
  return (
    <div>
      {/* Review Submission Section */}
      <div className="mb-3 flex">
        <div className="min-h-[55px] w-1.5 bg-gradient-to-b from-neon-green via-cyan-400 to-blue-500 rounded-full mr-3"></div>
        <div className="flex flex-col">
          <span className="bg-gradient-to-r from-neon-green to-blue-400 bg-clip-text text-transparent font-bold tracking-wider uppercase text-xl font-mono mb-1">Rate this Course</span>
          <div className="scale-110 origin-left">
            <StarRating rating={userRating} interactive onChange={setUserRating} size="lg" />
          </div>
        </div>
      </div>
      
      <div className="relative">
        <textarea 
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Share your experience with this course..."
          className="w-full pt-2 sm:pt-3 pb-12 px-2 sm:px-4 bg-cyber-dark border border-neon-green/30 rounded-lg text-white text-[11px] xs:text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-neon-green/50 min-h-[90px] sm:min-h-[100px] placeholder-gray-500"
          aria-label="Add a review"
        />
        
        <div className="absolute bottom-0 right-0 p-2 flex items-end space-x-1">
          <div className="text-[8px] xs:text-[10px] sm:text-xs text-neon-green/80 font-mono xs:whitespace-normal tracking-wider uppercase mb-1">
            {userRating === 0 ? 'Choose Rating to Submit Review' : ''}
          </div>
          <button 
            onClick={onSubmit}
            disabled={isSubmitting || !newReview.trim() || userRating === 0}
            className="flex items-center justify-center transition-colors touch-manipulation p-1 sm:p-1"
            aria-label="Submit review"
          >
            <Send className={`h-7 w-7 xs:h-8 xs:w-8 sm:h-9 sm:w-9 transition-colors ${
              newReview.trim() && userRating > 0
                ? 'text-neon-green hover:text-neon-green/80' 
                : 'text-gray-500 cursor-not-allowed'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}; 