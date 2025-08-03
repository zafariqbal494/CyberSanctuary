import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

const StarRating = ({ 
  rating, 
  interactive = false, 
  onChange, 
  size = 'md',
  readonly = false
}: StarRatingProps) => {
  const stars = [1, 2, 3, 4, 5];
  
  // Dynamic classes based on size
  const starSize = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[size];
  
  return (
    <div className="flex items-center">
      {stars.map(star => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onChange && onChange(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-150`}
          disabled={!interactive || readonly}
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star 
            className={cn(
              starSize,
              'transition-colors duration-150',
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-600'
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating; 