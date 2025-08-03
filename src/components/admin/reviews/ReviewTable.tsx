import { Review } from '@/types';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { MessageSquare, Trash2, ThumbsUp, User, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { useState } from 'react';

interface ReviewTableProps {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: 'created_at' | 'rating' | 'helpful_count') => void;
  onDelete: (id: number) => void;
  onRetry: () => void;
}

export const ReviewTable = ({ 
  reviews, 
  loading, 
  error, 
  sortBy, 
  sortOrder, 
  onSort, 
  onDelete,
  onRetry
}: ReviewTableProps) => {
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
  
  const handleDeleteClick = (id: number) => {
    setReviewToDelete(id);
  };
  
  const confirmDelete = () => {
    if (reviewToDelete !== null) {
      onDelete(reviewToDelete);
      setReviewToDelete(null);
    }
  };
  
  return (
    <>
      <div className="bg-cyber-dark rounded-lg border border-neon-green/30 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-neon-green/30 hover:bg-transparent">
              <TableHead className="text-white/70 w-[180px]">Username</TableHead>
              <TableHead className="text-white/70">Course</TableHead>
              <TableHead className="text-white/70 w-[100px]">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => onSort('rating')}
                >
                  Rating
                  {sortBy === 'rating' ? (
                    sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-white/70 w-[100px]">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => onSort('helpful_count')}
                >
                  Helpful
                  {sortBy === 'helpful_count' ? (
                    sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-white/70 w-[120px]">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => onSort('created_at')}
                >
                  Date
                  {sortBy === 'created_at' ? (
                    sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-white/70 w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array(5).fill(0).map((_, index) => (
                <TableRow key={index} className="border-b border-neon-green/10">
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-white/60">
                  <div className="flex flex-col items-center">
                    <MessageSquare className="h-8 w-8 mb-2 text-red-500" />
                    <p>{error}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 border-neon-green/30 text-neon-green"
                      onClick={onRetry}
                    >
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-white/60">
                  <div className="flex flex-col items-center">
                    <MessageSquare className="h-8 w-8 mb-2 text-white/40" />
                    <p>No reviews found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              reviews.map(review => (
                <>
                  <TableRow key={review.id} className="border-b border-neon-green/10 hover:bg-cyber-light/10">
                    <TableCell className="font-mono">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-neon-green" />
                        {review.user_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-neon-green/30 text-white/90">
                        {review.course?.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={review.rating} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ThumbsUp className="h-3.5 w-3.5 mr-1 text-neon-green" />
                        {review.helpful_count}
                      </div>
                    </TableCell>
                    <TableCell className="text-white/70 text-sm">
                      {new Date(review.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(review.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow key={`${review.id}-content`} className="border-b border-neon-green/10 bg-cyber-light/5">
                    <TableCell colSpan={6} className="py-1 px-4">
                      <p className="text-white/80 text-xs">{review.content}</p>
                    </TableCell>
                  </TableRow>
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={reviewToDelete !== null} onOpenChange={() => setReviewToDelete(null)}>
        <AlertDialogContent className="bg-cyber-dark border-neon-green/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-cyber-light border-neon-green/30 text-white hover:bg-cyber-light/80">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}; 