import { useMemo } from 'react';
import StarRating from '@/components/courses/StarRating';
import { Review } from '@/types';

interface ReviewStatsProps {
  reviews: Review[] | undefined;
}

export const ReviewStats = ({ reviews }: ReviewStatsProps) => {
  // Calculate review statistics
  const reviewStats = useMemo(() => {
    const stats = {
      total: reviews?.length || 0,
      average: 0,
      distribution: [0, 0, 0, 0, 0] // 5 stars to 1 star
    };
    
    if (reviews && reviews.length > 0) {
      let sum = 0;
      reviews.forEach(review => {
        sum += review.rating;
        if (review.rating >= 1 && review.rating <= 5) {
          stats.distribution[5 - review.rating]++;
        }
      });
      stats.average = sum / reviews.length;
    }
    
    return stats;
  }, [reviews]);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="flex items-center pl-2 mb-2">
        <div className="w-1 h-8 bg-gradient-to-b from-neon-green to-blue-500 rounded-full mr-3"></div>
        <span className="bg-gradient-to-r from-neon-green to-blue-400 bg-clip-text text-transparent font-bold tracking-wider uppercase text-2xl font-mono">Course Rating</span>
      </h3>
      <div className="bg-cyber-darker rounded-lg p-3 border border-neon-green/30 shadow-[0_0_15px_rgba(0,255,65,0.15)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 255, 170, 0.4) 0%, transparent 60%)',
          mixBlendMode: 'overlay'
        }}></div>
        <div className="flex items-center gap-6 relative z-10">
          {/* Average rating display */}
          <div className="flex flex-col items-center">
            <div className="text-5xl font-bold text-white font-mono relative">
              {reviewStats.average.toFixed(1)}
              <div className="absolute -inset-1 bg-neon-green/20 blur-md -z-10 rounded-lg"></div>
            </div>
            <div className="mt-1 flex justify-center w-full">
              <StarRating rating={Math.round(reviewStats.average)} size="md" />
            </div>
            <div className="text-sm text-neon-green/80 mt-1 font-mono">({reviewStats.total.toLocaleString()})</div>
          </div>
          
          {/* Rating distribution chart */}
          <div className="flex-1 w-full">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center gap-2 mb-1.5 last:mb-0">
                <div className="flex items-center w-4">
                  <span className="text-xs text-neon-green font-mono">{star}</span>
                </div>
                <div className="flex-1 bg-cyber-dark h-1.5 rounded-sm overflow-hidden border border-neon-green/20">
                  <div
                    className="bg-neon-green h-full relative"
                    style={{
                      width: reviewStats.total ? `${(reviewStats.distribution[5 - star] / reviewStats.total) * 100}%` : '0%',
                      boxShadow: '0 0 10px rgba(0, 255, 65, 0.5)'
                    }}
                  >
                    <div className="absolute top-0 right-0 h-full w-1 bg-white/50"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 