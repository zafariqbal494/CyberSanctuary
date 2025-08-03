import { useState } from 'react';

export interface UseWizardOptions {
  initialStep?: number;
  totalSteps: number;
}

export interface UseWizardReturn {
  currentStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
}

/**
 * A hook for managing wizard/stepper flows
 */
export function useWizard({ 
  initialStep = 1, 
  totalSteps 
}: UseWizardOptions): UseWizardReturn {
  const [currentStep, setCurrentStep] = useState(initialStep);
  
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  
  // Go to a specific step
  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };
  
  // Go to the next step
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Go to the previous step
  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Reset to initial step
  const reset = () => {
    setCurrentStep(initialStep);
  };
  
  return {
    currentStep,
    isFirstStep,
    isLastStep,
    goToStep,
    nextStep,
    previousStep,
    reset
  };
} 