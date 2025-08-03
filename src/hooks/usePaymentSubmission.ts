import { useState } from 'react';
import { paymentService, PaymentResponse } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export interface PaymentDetails {
  username: string;
  email: string;
  courseId: number;
  price: number;
  screenshot: File | null;
}

export interface OrderDetails {
  orderId: string;
  amount: number;
  status: string;
}

export function usePaymentSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    orderId: '',
    amount: 0,
    status: 'pending'
  });
  const [isComplete, setIsComplete] = useState(false);
  
  const submitPayment = async (paymentDetails: PaymentDetails): Promise<boolean> => {
    const { username, email, courseId, price, screenshot } = paymentDetails;
    
    if (!screenshot) {
      toast({
        title: "No File Selected",
        description: "Please upload a screenshot of your payment",
        variant: "destructive"
      });
      return false;
    }
    
    if (!username || !email) {
      toast({
        title: "Missing Information",
        description: "Please fill in both username and email address",
        variant: "destructive"
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData object to send file
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('course_id', courseId.toString());
      formData.append('amount', price.toString());
      formData.append('screenshot', screenshot);
      
      // Make API call to submit payment
      const responseData = await paymentService.submitPayment(formData);
      
      // Update order details with response data
      setOrderDetails({
        orderId: responseData.order_id || '',
        amount: price,
        status: responseData.status || 'pending'
      });
      
      setIsComplete(true);
      toast({
        title: "Payment Submitted",
        description: "Your payment verification has been submitted successfully.",
      });
      
      return true;
    } catch (err: any) {
      console.error('Error submitting payment:', err);
      toast({
        title: "Submission Error",
        description: err.message || "Failed to submit payment verification",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    submitPayment,
    isSubmitting,
    orderDetails,
    isComplete,
    resetState: () => {
      setIsComplete(false);
      setOrderDetails({
        orderId: '',
        amount: 0,
        status: 'pending'
      });
    }
  };
} 