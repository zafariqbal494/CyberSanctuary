import { useState, useCallback } from 'react';
import { ThumbsUp } from 'lucide-react';
import StarRating from '@/components/courses/StarRating';
import { Review } from '@/types';
import { formatDate } from '@/utils/courseUtils';
import { 
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, 
  PaginationLink, PaginationNext, PaginationPrevious 
} from "@/components/ui/pagination";

interface ReviewsListProps {
  reviews: Review[] | undefined;
  onHelpfulClick: () => void;
}

export const ReviewsList = ({ reviews, onHelpfulClick }: ReviewsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  
  // Calculate pagination values
  const totalReviews = reviews?.length || 0;
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = Math.min(startIndex + reviewsPerPage, totalReviews);
  const currentReviews = reviews?.slice(startIndex, endIndex) || [];
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of reviews section
      const reviewsElement = document.getElementById('reviews-section');
      if (reviewsElement) {
        reviewsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  // Generate pagination items
  const renderPaginationItems = () => {
    if (totalPages <= 1) return null;
    
    const items = [];
    
    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => handlePageChange(currentPage - 1)}
          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
        />
      </PaginationItem>
    );
    
    // First page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink 
          isActive={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Pages around current
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Last page if not first page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => handlePageChange(currentPage + 1)}
          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
        />
      </PaginationItem>
    );
    
    return items;
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-6 text-center text-white/60">
        <p>No reviews yet. Be the first to review this course!</p>
      </div>
    );
  }

  return (
    <div id="reviews-section" className="mt-4 comments-scrollable pr-2 space-y-3 sm:space-y-4">
      <div className="space-y-3 sm:space-y-4">
        {currentReviews.map(review => (
          <div key={review.id} className="pb-3 sm:pb-5 last:pb-0">
            <div className="flex flex-col">
              {/* Review header with username and verified badge */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <p className="text-white font-medium font-mono bg-cyber-dark px-2 py-0.5 rounded text-xs sm:text-sm border border-neon-green/10">
                    {review.user_name}<span className="text-blue-400/70">_</span>
                  </p>
                </div>
                <div className="flex items-end">
                  <div className="bg-neon-green/90 text-black text-xs sm:text-sm px-3 py-0.5 rounded font-mono font-bold shadow-sm shadow-neon-green/30">
                    VERIFIED
                  </div>
                </div>
              </div>
              
              {/* Review content with stars, date, and text */}
              <div className="ml-2 relative">
                <div className="absolute top-0 left-0 w-[1px] h-full bg-neon-green/10"></div>
                <div className="pl-3">
                  <div className="mb-1 sm:mb-2 flex items-center justify-between">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-[10px] xs:text-xs text-gray-400 font-mono -mt-2">{formatDate(review.created_at)}</span>
                  </div>
                  <p className="text-gray-300 text-[11px] xs:text-xs sm:text-sm leading-tight sm:leading-normal">{review.content}</p>
                </div>
                
                {/* Helpful button */}
                <div className="flex items-center mt-2 sm:mt-3 text-xs text-gray-400 pl-3">
                  <button 
                    onClick={onHelpfulClick}
                    className="flex items-center transition-colors bg-cyber-dark px-2 py-1 rounded-full min-h-[32px] min-w-[60px] touch-manipulation text-gray-400 hover:text-neon-green"
                    aria-label="Mark review as helpful"
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    <span>
                      Helpful{review.helpful_count > 0 && ` (${review.helpful_count})`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent className="bg-cyber-light/20 p-1 rounded-lg border border-neon-green/20">
              {renderPaginationItems()}
            </PaginationContent>
          </Pagination>
        </div>
      )}
      
      {/* Reviews count */}
      <div className="mt-2 text-center">
        <p className="text-xs text-white/50 font-mono">
          Showing {startIndex + 1}-{endIndex} of {totalReviews} reviews
        </p>
      </div>
    </div>
  );
}; 