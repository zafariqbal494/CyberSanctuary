import { Button } from "@/components/ui/button";
import { Bitcoin } from 'lucide-react';

interface MobilePaymentButtonProps {
  isScrolled: boolean;
  price: number;
  onPaymentClick: () => void;
}

export const MobilePaymentButton = ({ isScrolled, price, onPaymentClick }: MobilePaymentButtonProps) => {
  return (
    <div className={`fixed left-0 right-0 bottom-0 p-4 bg-cyber-darker border-t border-neon-green/30 
      transition-all duration-300 ${isScrolled ? 'translate-y-0' : 'translate-y-full'}`}>
      <Button 
        className="btn-cyber w-full py-4 flex items-center justify-center gap-2 text-base"
        onClick={onPaymentClick}
      >
        <Bitcoin className="h-5 w-5" />
        Pay with Bitcoin - ${price}
      </Button>
    </div>
  );
}; 