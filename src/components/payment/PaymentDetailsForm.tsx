import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { WalletAddressDisplay } from './WalletAddressDisplay';
import { PaymentProofUploader } from './PaymentProofUploader';

interface PaymentDetailsFormProps {
  price: number;
  onSubmit: (file: File) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export const PaymentDetailsForm = ({ 
  price, 
  onSubmit, 
  onBack,
  isSubmitting = false 
}: PaymentDetailsFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit(selectedFile);
    }
  };
  
  return (
    <div className="space-y-3 sm:space-y-4">
      <WalletAddressDisplay price={price} />
      
      <PaymentProofUploader onFileSelected={setSelectedFile} />
      
      <div className="pt-1 sm:pt-2">
        <Button 
          type="button" 
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedFile}
          className="w-full bg-neon-green hover:bg-neon-green/90 text-cyber-dark font-mono text-sm sm:text-sm py-2 sm:py-2 rounded-lg"
        >
          {isSubmitting ? 'Processing...' : 'Submit Payment Verification'}
        </Button>
        
        <Button
          type="button"
          onClick={onBack}
          className="w-full mt-2 bg-transparent border border-neon-green/40 hover:bg-cyber-light/30 text-neon-green/90 font-mono text-sm sm:text-sm py-2 sm:py-2 rounded-lg"
        >
          Back to Information
        </Button>
      </div>
    </div>
  );
}; 