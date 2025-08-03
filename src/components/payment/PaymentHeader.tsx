import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PaymentHeaderProps {
  price: number;
  courseName: string;
}

export const PaymentHeader = ({ price, courseName }: PaymentHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-neon-green/20 to-transparent p-3 sm:p-4 sm:py-3 rounded-t-xl">
      <div className="flex items-center justify-between mb-1">
        <p className="text-base sm:text-lg text-white/70 font-mono font-bold">
          ${price}
        </p>
      </div>
      <DialogHeader className="sm:py-0">
        <DialogTitle className="text-lg sm:text-xl font-mono text-white">
          Enroll in {courseName}
        </DialogTitle>
      </DialogHeader>
    </div>
  );
}; 