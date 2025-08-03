import { Button } from "@/components/ui/button";
import { OrderDetails } from '@/hooks/usePaymentSubmission';

interface VerificationConfirmationProps {
  orderDetails: OrderDetails;
  onClose: () => void;
}

export const VerificationConfirmation = ({ orderDetails, onClose }: VerificationConfirmationProps) => {
  return (
    <div className="p-4 sm:p-6 rounded-b-xl">
      <h2 className="text-xl font-bold font-mono mb-2 bg-gradient-to-r from-neon-green to-yellow-500 bg-clip-text text-transparent text-center">
        Verification Submitted
      </h2>

      <p className="text-white/80 text-xs sm:text-sm mb-2 font-mono leading-relaxed text-center">
        Your payment proof has been submitted successfully.
      </p>

      <div className="space-y-2 bg-black/30 p-3 rounded-lg border border-neon-green/20">
        <div className="flex justify-between items-center">
          <span className="text-white/60 font-mono text-xs">Order ID:</span>
          <span className="text-white/60 font-mono text-xs">{orderDetails.orderId}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/60 font-mono text-xs">Amount:</span>
          <span className="text-white/60 font-mono text-xs">
            ${typeof orderDetails.amount === 'number' ? orderDetails.amount.toFixed(2) : '0.00'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/60 font-mono text-xs">Status:</span>
          <span className="text-yellow-500 font-mono text-xs uppercase bg-yellow-500/20 px-2 py-0.5 rounded-lg border border-yellow-500/30">
            Pending Verification
          </span>
        </div>
      </div>

      <div className="mt-4 bg-cyber-light/30 p-3 rounded-lg border border-neon-green/20">
        <p className="text-white/80 text-xs font-mono leading-relaxed">
          Your payment is being verified. Once approved, you'll receive course access credentials via email. This process typically takes 1-24 hours.
        </p>
      </div>

      <div className="mt-4">
        <Button 
          type="button" 
          onClick={onClose}
          className="w-full bg-cyber-light border border-neon-green/30 hover:bg-cyber-light/80 text-neon-green font-mono text-xs sm:text-sm py-1.5 sm:py-2 rounded-lg"
        >
          Close
        </Button>
      </div>
    </div>
  );
}; 