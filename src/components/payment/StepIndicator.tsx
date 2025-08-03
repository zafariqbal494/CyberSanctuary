import { ArrowRight } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export const StepIndicator = ({ currentStep, totalSteps = 2 }: StepIndicatorProps) => {
  return (
    <div 
      className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2 bg-black/30 border-y border-neon-green/20"
      role="navigation" 
      aria-label="Payment process steps"
    >
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isLast = stepNumber === totalSteps;
          
          return (
            <div key={stepNumber} className="flex items-center">
              <div className={`flex items-center ${isActive ? 'text-neon-green' : 'text-white/50'}`}>
                <span 
                  className="h-5 w-5 sm:h-5 sm:w-5 rounded-full flex items-center justify-center text-xs sm:text-xs border mr-2 sm:mr-2 bg-cyber-dark"
                  aria-current={isActive ? "step" : undefined}
                >
                  {stepNumber}
                </span>
                <span className="text-sm sm:text-sm font-mono">
                  {stepNumber === 1 ? 'Information' : 'Payment'}
                </span>
              </div>
              
              {!isLast && (
                <ArrowRight className="h-3 w-3 sm:h-3 sm:w-3 mx-3 sm:mx-3 text-white/30" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}; 