import { useState } from 'react';
import { format } from 'date-fns';
import { reviewService, NewReview } from '@/services/reviewService';
import { toast } from '@/hooks/use-toast';
import { Review } from '@/types';

interface ReviewFormData {
  course_id: string;
  user_name: string;
  rating: number;
  content: string;
  helpful_count: number;
  created_at: Date;
}

interface FormErrors {
  course_id?: string;
  user_name?: string;
  content?: string;
}

export const useReviewForm = (onSuccess: (review: Review) => void) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    course_id: '',
    user_name: '',
    rating: 5,
    content: '',
    helpful_count: 0,
    created_at: new Date()
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const updateField = <K extends keyof ReviewFormData>(field: K, value: ReviewFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is updated
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FormErrors];
        return newErrors;
      });
    }
  };
  
  const resetForm = () => {
    setFormData({
      course_id: '',
      user_name: '',
      rating: 5,
      content: '',
      helpful_count: 0,
      created_at: new Date()
    });
    setErrors({});
  };
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.course_id) {
      newErrors.course_id = 'Please select a course';
    }
    
    if (!formData.user_name.trim()) {
      newErrors.user_name = 'Please enter a username';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Please enter review content';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const submitForm = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Format date for API
      const formattedDate = format(formData.created_at, "yyyy-MM-dd HH:mm:ss");
      
      const reviewData: NewReview = {
        ...formData,
        created_at: formattedDate
      };
      
      const review = await reviewService.createReview(reviewData);
      
      // Reset form
      resetForm();
      
      // Call success callback
      onSuccess(review);
      
      toast({
        title: "Success",
        description: "Review created successfully",
      });
    } catch (err: any) {
      console.error('Error creating review:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to create review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    updateField,
    errors,
    isSubmitting,
    submitForm,
    resetForm
  };
}; 