import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bitcoin } from 'lucide-react';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll: () => void;
  price: number;
}

export const EnrollmentModal = ({ isOpen, onClose, onEnroll, price }: EnrollmentModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="mx-auto w-[calc(100%-32px)] max-w-xs sm:max-w-md bg-cyber-dark border border-neon-green/30 p-3 sm:p-6 rounded-lg">
        <DialogTitle className="text-lg sm:text-xl font-mono text-neon-green mb-2 sm:mb-3">Enrollment Required</DialogTitle>
        
        <div className="py-2 sm:py-4">
          <p className="text-white text-sm sm:text-base mb-2 sm:mb-4">Only enrolled students can submit reviews for this course.</p>
          <p className="text-white/70 text-xs sm:text-sm mb-4 sm:mb-6">Your review has been saved and will be submitted automatically after enrollment.</p>
          
          <div className="flex justify-center">
            <Button 
              className="bg-neon-green hover:bg-neon-green/90 text-black py-1 sm:py-2 text-sm w-full sm:w-auto"
              onClick={onEnroll}
            >
              <Bitcoin className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Enroll Now (${price})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 