import { useState } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useReviews } from '@/hooks/useReviews';
import { useCourses } from '@/hooks/useCourses';
import { useReviewForm } from '@/hooks/useReviewForm';
import { ReviewFilters } from '@/components/admin/reviews/ReviewFilters';
import { ReviewTable } from '@/components/admin/reviews/ReviewTable';
import { PaginationControl } from '@/components/admin/reviews/PaginationControl';
import { ReviewForm } from '@/components/admin/reviews/ReviewForm';

const ReviewManagement = () => {
  // Get reviews data and actions from custom hook
  const {
    reviews,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    deleteReview,
    fetchReviews,
    addReview
  } = useReviews();
  
  // Get courses data from custom hook
  const { courses, loading: coursesLoading } = useCourses();
  
  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Review form state and actions from custom hook
  const {
    formData,
    updateField,
    errors,
    isSubmitting,
    submitForm,
    resetForm
  } = useReviewForm((review) => {
    addReview(review);
      setIsCreateModalOpen(false);
  });
  
  // Handle sort change
  const handleSortChange = (field: 'created_at' | 'rating' | 'helpful_count') => {
    if (field === filters.sortBy) {
      // Toggle sort order if clicking the same field
      updateFilters({
        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // Set new sort field with default desc order
      updateFilters({
        sortBy: field,
        sortOrder: 'desc'
      });
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };
  
  // Handle opening the create modal
  const handleOpenCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };
  
  // Handle closing the create modal
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-mono font-bold text-white">
            Review <span className="text-neon-green">Management</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Manage course reviews and testimonials
          </p>
        </div>
        
        <Button 
          onClick={handleOpenCreateModal}
          className="bg-neon-green hover:bg-neon-green/90 text-black"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Manual Review
        </Button>
      </div>
      
      {/* Filters */}
      <ReviewFilters 
        courses={courses} 
        currentFilters={filters}
        onApplyFilters={updateFilters}
        isLoading={loading || coursesLoading}
      />
      
      {/* Reviews Table */}
      <ReviewTable 
        reviews={reviews}
        loading={loading}
        error={error}
        sortBy={filters.sortBy || 'created_at'}
        sortOrder={filters.sortOrder || 'desc'}
        onSort={handleSortChange}
        onDelete={deleteReview}
        onRetry={() => fetchReviews()}
      />
      
      {/* Pagination */}
      {!loading && !error && reviews.length > 0 && (
        <div className="mt-4 flex justify-center">
          <PaginationControl 
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Create Review Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-cyber-dark border-neon-green/30 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-neon-green font-mono">Add Manual Review</DialogTitle>
          </DialogHeader>
          
          <ReviewForm 
            courses={courses}
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            updateField={updateField}
            onSubmit={submitForm}
            onCancel={handleCloseCreateModal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewManagement; 