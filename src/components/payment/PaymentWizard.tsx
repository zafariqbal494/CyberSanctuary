import { useState } from 'react';
import { useWizard } from '@/hooks/useWizard';
import { usePaymentSubmission } from '@/hooks/usePaymentSubmission';

// Import components
import {
  StepIndicator,
  PaymentHeader,
  UserInfoForm,
  PaymentDetailsForm,
  VerificationConfirmation
} from '@/components/payment';

// Types
import { UserFormData } from '@/components/payment/UserInfoForm';

export interface PaymentWizardProps {
  courseName: string;
  price: number;
  courseId: number;
  onComplete?: () => void;
}

const PaymentWizard = ({ 
  courseName, 
  price, 
  courseId,
  onComplete
}: PaymentWizardProps) => {
  // Use our custom wizard hook to manage steps
  const { currentStep, nextStep, previousStep } = useWizard({
    totalSteps: 2
  });

  // Form data state
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
  }>({
    username: '',
    email: ''
  });
  
  // Use the payment submission hook
  const { 
    submitPayment, 
    isSubmitting, 
    orderDetails, 
    isComplete 
  } = usePaymentSubmission();
  
  // Handle form submission for step 1
  const handleUserInfoSubmit = (data: UserFormData) => {
    setFormData({
      username: data.username,
      email: data.email
    });
    nextStep();
  };
  
  // Handle payment submission
  const handlePaymentSubmit = async (file: File) => {
    await submitPayment({
      username: formData.username,
      email: formData.email,
      courseId,
      price,
      screenshot: file
    });
    
    // If there's a completion callback, call it
    if (isComplete && onComplete) {
      onComplete();
    }
  };

  // Show completion screen if payment is complete
  if (isComplete) {
    return (
      <VerificationConfirmation
        orderDetails={orderDetails}
        onClose={onComplete}
      />
    );
  }

  return (
    <>
      <PaymentHeader price={price} courseName={courseName} />
      
      {/* Step Indicator */}
      <div className="-mt-2 sm:-mt-2">
        <StepIndicator currentStep={currentStep} />
      </div>
  
      <div className="p-3 pt-0.5 sm:p-4 sm:pt-2">
        {currentStep === 1 ? (
          <UserInfoForm 
            onSubmit={handleUserInfoSubmit}
            initialValues={formData}
          />
        ) : (
          <PaymentDetailsForm
            price={price}
            onSubmit={handlePaymentSubmit}
            onBack={previousStep}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </>
  );
};

export default PaymentWizard; 