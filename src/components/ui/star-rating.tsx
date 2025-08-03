import { Star } from 'lucide-react';
import { memo } from 'react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export const StarRating = memo(({ 
  rating, 
  max = 5, 
  size = 'md',
  interactive = false,
  onChange
}: StarRatingProps) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  const sizeClass = sizeClasses[size];
  
  return (
    <div className="flex">
      {Array(max).fill(0).map((_, i) => (
        <Star 
          key={i} 
          className={`${sizeClass} ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} ${interactive ? 'cursor-pointer' : ''}`}
          onClick={() => interactive && onChange && onChange(i + 1)}
        />
      ))}
    </div>
  );
});

StarRating.displayName = 'StarRating'; 