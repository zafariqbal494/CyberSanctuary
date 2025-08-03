import { Search, Filter, Star } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Course } from '@/types';
import { useState, useEffect } from 'react';
import { ReviewFilters as FiltersType } from '@/services/reviewService';

interface ReviewFiltersProps {
  courses: Course[];
  currentFilters: FiltersType;
  onApplyFilters: (filters: Partial<FiltersType>) => void;
  isLoading?: boolean;
}

export const ReviewFilters = ({ 
  courses, 
  currentFilters, 
  onApplyFilters,
  isLoading = false
}: ReviewFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');
  const [selectedCourse, setSelectedCourse] = useState(currentFilters.courseId || 'all');
  const [selectedRating, setSelectedRating] = useState(currentFilters.rating || 'all');
  
  // Update local state when props change
  useEffect(() => {
    setSearchTerm(currentFilters.search || '');
    setSelectedCourse(currentFilters.courseId || 'all');
    setSelectedRating(currentFilters.rating || 'all');
  }, [currentFilters]);
  
  const handleApplyFilters = () => {
    onApplyFilters({
      search: searchTerm,
      courseId: selectedCourse,
      rating: selectedRating
    });
  };
  
  return (
    <div className="bg-cyber-light p-4 rounded-lg mb-6 border border-neon-green/30">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input
              placeholder="Search reviews..."
              className="pl-9 bg-cyber-dark border-neon-green/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            />
          </div>
        </div>
        
        <div className="w-full md:w-48">
          <Select
            value={selectedCourse}
            onValueChange={setSelectedCourse}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-cyber-dark border-neon-green/30">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-neon-green" />
                <span className="truncate">
                  {selectedCourse === 'all' ? 'All Courses' : courses.find(c => c.id.toString() === selectedCourse)?.name || 'Course'}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-cyber-dark border-neon-green/30">
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-40">
          <Select
            value={selectedRating}
            onValueChange={setSelectedRating}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-cyber-dark border-neon-green/30">
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4 text-yellow-400" />
                <span>{selectedRating === 'all' ? 'All Ratings' : `${selectedRating} Stars`}</span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-cyber-dark border-neon-green/30">
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleApplyFilters}
          className="bg-neon-green hover:bg-neon-green/90 text-black"
          disabled={isLoading}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}; 