import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from 'lucide-react';

// Import the new PaymentWizard component
import PaymentWizard from '@/components/payment/PaymentWizard';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  price: number;
  courseId: number;
}

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  courseName, 
  price, 
  courseId 
}: PaymentModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cyber-dark border border-neon-green/30 text-white sm:max-w-md p-0 overflow-hidden mx-auto w-[calc(100%-32px)] rounded-xl">
        <div className="absolute right-4 top-4 z-50">
          <button 
            onClick={onClose} 
            className="rounded-full p-1 hover:bg-white/10"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>
        
        <PaymentWizard 
          courseName={courseName}
          price={price}
          courseId={courseId}
          onComplete={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
