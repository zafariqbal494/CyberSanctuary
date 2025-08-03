import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface CourseSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CourseSearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search courses..." 
}: CourseSearchBarProps) => {
  return (
    <div className="mb-6">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
        <Input
          type="text"
          placeholder={placeholder}
          className="pl-10 bg-cyber-light border-neon-green/30 text-white w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CourseSearchBar; 