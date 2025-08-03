import { BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EmptyCoursesViewProps {
  onClearSearch: () => void;
}

const EmptyCoursesView = ({ onClearSearch }: EmptyCoursesViewProps) => {
  return (
    <div className="text-center py-12 bg-cyber-dark/50 rounded-lg border border-neon-green/20 mt-4">
      <BookOpen className="h-12 w-12 text-white/20 mx-auto mb-4" />
      <p className="text-white/70 mb-2">No courses match your search criteria.</p>
      <Button 
        variant="outline" 
        className="border-neon-green/30 text-neon-green hover:bg-neon-green/10 mt-2" 
        onClick={onClearSearch}
      >
        Clear search
      </Button>
    </div>
  );
};

export default EmptyCoursesView; 