import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Save } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Course } from '@/types';

interface PurchasesCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onUpdate: (updatedCourse: Course) => void;
}

const PurchasesCountModal = ({ isOpen, onClose, course, onUpdate }: PurchasesCountModalProps) => {
  const [count, setCount] = useState(course.purchases_count || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (count < 0) {
      toast({
        title: "Invalid Count",
        description: "Purchases count cannot be negative",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the API to update the purchases count
      const response = await fetch(`http://127.0.0.1:8000/api/courses/${course.id}/purchases-count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ purchases_count: count }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update purchases count');
      }
      
      const data = await response.json();
      
      toast({
        title: "Purchases Count Updated",
        description: `The purchases count for ${course.name} has been updated successfully.`,
      });
      
      // Update the course in the parent component
      onUpdate({
        ...course,
        purchases_count: count
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating purchases count:', error);
      toast({
        title: "Error",
        description: "Failed to update purchases count. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cyber-dark border border-neon-green/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-neon-green" />
            <span>Update Purchases Count</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="course-name" className="text-white/70">Course</Label>
            <Input
              id="course-name"
              value={course.name}
              disabled
              className="bg-cyber-darker border-neon-green/20 text-white/50"
            />
          </div>
          
          <div>
            <Label htmlFor="purchases-count" className="text-white/70">
              Purchases Count
            </Label>
            <Input
              id="purchases-count"
              type="number"
              min="0"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 0)}
              className="bg-cyber-light border-neon-green/30 text-white"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="border-neon-green/30 text-white" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-neon-green hover:bg-neon-green/90 text-black font-mono"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchasesCountModal; 