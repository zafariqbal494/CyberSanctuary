import { useState, useEffect, useCallback } from 'react';
import { Review } from '@/types';
import { reviewService, ReviewFilters, PaginatedResponse } from '@/services/reviewService';
import { toast } from '@/hooks/use-toast';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [filters, setFilters] = useState<ReviewFilters>({
    search: '',
    courseId: 'all',
    rating: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc',
    page: 1
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0
  });
  
  const fetchReviews = useCallback(async (page?: number) => {
    try {
      setLoading(true);
      
      const updatedFilters = { ...filters };
      if (page) {
        updatedFilters.page = page;
      }
      
      const data = await reviewService.getReviews(updatedFilters);
      
      setReviews(data.data);
      setPagination({
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total
      });
      
      setError(null);
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setError(err.message || 'Failed to load reviews');
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  // Update filters and fetch reviews
  const updateFilters = useCallback((newFilters: Partial<ReviewFilters>) => {
    setFilters(prev => {
      // If we're changing anything other than page, reset to page 1
      const shouldResetPage = Object.keys(newFilters).some(key => key !== 'page');
      
      return {
        ...prev,
        ...(shouldResetPage ? { page: 1 } : {}),
        ...newFilters
      };
    });
  }, []);
  
  // Delete a review
  const deleteReview = useCallback(async (id: number) => {
    try {
      await reviewService.deleteReview(id);
      
      // Update local state
      setReviews(prev => prev.filter(review => review.id !== id));
      
      // Update pagination total
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1
      }));
      
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
    } catch (err: any) {
      console.error('Error deleting review:', err);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive"
      });
    }
  }, []);
  
  // Add a new review to the list
  const addReview = useCallback((review: Review) => {
    setReviews(prev => [review, ...prev]);
    setPagination(prev => ({
      ...prev,
      total: prev.total + 1
    }));
  }, []);
  
  // Fetch reviews when filters change
  useEffect(() => {
    fetchReviews();
  }, [filters, fetchReviews]);
  
  return {
    reviews,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    deleteReview,
    fetchReviews,
    addReview
  };
}; 