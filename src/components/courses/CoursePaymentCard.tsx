import { Button } from "@/components/ui/button";
import { Bitcoin, Lock, Shield } from 'lucide-react';
import { Course } from '@/types';

interface CoursePaymentCardProps {
  course: Course;
  isMobile: boolean;
  onPaymentClick: () => void;
}

export const CoursePaymentCard = ({ course, isMobile, onPaymentClick }: CoursePaymentCardProps) => {
  if (isMobile) {
    return (
      <div className="cyber-border bg-cyber-light p-4 mb-6 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-mono font-bold">${course.price}</h3>
          <span className="text-xs font-mono text-neon-green bg-cyber-dark/80 px-2 py-1 border border-neon-green/40 rounded">
            {course.purchases_count || 0} Purchases
          </span>
        </div>
        <p className="text-white/60 mb-4 text-sm">One-time purchase</p>
        
        <Button 
          className="btn-cyber w-full py-2 md:py-3 flex items-center justify-center gap-2"
          onClick={onPaymentClick}
        >
          <Bitcoin className="h-5 w-5" />
          Pay with Bitcoin
        </Button>
        
        <div className="flex mt-4 justify-center gap-4">
          <div className="flex items-center gap-2 bg-cyber-dark/60 p-2 rounded">
            <Lock className="text-neon-green h-4 w-4 flex-shrink-0" />
            <p className="text-white/80 text-xs">Secure Transaction</p>
          </div>
          <div className="flex items-center gap-2 bg-cyber-dark/60 p-2 rounded">
            <Shield className="text-neon-green h-4 w-4 flex-shrink-0" />
            <p className="text-white/80 text-xs">Lifetime Access</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="lg:col-span-1 mt-2 md:mt-10">
      <div className="cyber-border bg-cyber-light p-5 sticky top-24 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-mono font-bold">${course.price}</h3>
          <span className="text-sm font-mono text-neon-green bg-cyber-dark/80 px-2 py-1 border border-neon-green/40 rounded">
            {course.purchases_count || 0} Purchases
          </span>
        </div>
        <p className="text-white/60 mb-4">One-time purchase</p>
        
        <Button 
          className="btn-cyber w-full py-2 md:py-3 flex items-center justify-center gap-2 text-base"
          onClick={onPaymentClick}
        >
          <Bitcoin className="h-5 w-5" />
          Pay with Bitcoin
        </Button>
        
        <div className="flex mt-4 justify-center gap-4">
          <div className="flex items-center gap-2 bg-cyber-dark/60 p-2 rounded">
            <Lock className="text-neon-green h-4 w-4 flex-shrink-0" />
            <p className="text-white/80 text-xs">Secure Transaction</p>
          </div>
          <div className="flex items-center gap-2 bg-cyber-dark/60 p-2 rounded">
            <Shield className="text-neon-green h-4 w-4 flex-shrink-0" />
            <p className="text-white/80 text-xs">Lifetime Access</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 