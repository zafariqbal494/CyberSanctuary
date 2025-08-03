import { Course } from '@/types';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { StarRating } from "@/components/ui/star-rating";

interface ReviewFormData {
  course_id: string;
  user_name: string;
  rating: number;
  content: string;
  helpful_count: number;
  created_at: Date;
}

interface FormErrors {
  course_id?: string;
  user_name?: string;
  content?: string;
}

interface ReviewFormProps {
  courses: Course[];
  formData: ReviewFormData;
  errors: FormErrors;
  isSubmitting: boolean;
  updateField: <K extends keyof ReviewFormData>(field: K, value: ReviewFormData[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const ReviewForm = ({
  courses,
  formData,
  errors,
  isSubmitting,
  updateField,
  onSubmit,
  onCancel
}: ReviewFormProps) => {
  return (
    <div className="space-y-4 py-4">
      {/* Course Selection */}
      <div className="space-y-2">
        <Label htmlFor="course">Course</Label>
        <Select
          value={formData.course_id}
          onValueChange={(value) => updateField('course_id', value)}
        >
          <SelectTrigger className={cn(
            "bg-cyber-light border-neon-green/30",
            errors.course_id && "border-red-500"
          )}>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent className="bg-cyber-dark border-neon-green/30">
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.course_id && (
          <p className="text-red-500 text-xs mt-1">{errors.course_id}</p>
        )}
      </div>
      
      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="Display name for the review"
          className={cn(
            "bg-cyber-light border-neon-green/30",
            errors.user_name && "border-red-500"
          )}
          value={formData.user_name}
          onChange={(e) => updateField('user_name', e.target.value)}
        />
        {errors.user_name && (
          <p className="text-red-500 text-xs mt-1">{errors.user_name}</p>
        )}
      </div>
      
      {/* Rating */}
      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex gap-2">
          <StarRating 
            rating={formData.rating} 
            interactive 
            onChange={(rating) => updateField('rating', rating)}
            size="lg"
          />
        </div>
      </div>
      
      {/* Review Content */}
      <div className="space-y-2">
        <Label htmlFor="content">Review Content</Label>
        <Textarea
          id="content"
          placeholder="Write the review content here..."
          className={cn(
            "bg-cyber-light border-neon-green/30 min-h-[100px]",
            errors.content && "border-red-500"
          )}
          value={formData.content}
          onChange={(e) => updateField('content', e.target.value)}
        />
        {errors.content && (
          <p className="text-red-500 text-xs mt-1">{errors.content}</p>
        )}
      </div>
      
      {/* Helpful Count */}
      <div className="space-y-2">
        <Label htmlFor="helpful">Helpful Count</Label>
        <Input
          id="helpful"
          type="number"
          min="0"
          className="bg-cyber-light border-neon-green/30"
          value={formData.helpful_count}
          onChange={(e) => updateField('helpful_count', parseInt(e.target.value) || 0)}
        />
      </div>
      
      {/* Date Picker */}
      <div className="space-y-2">
        <Label>Review Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal bg-cyber-light border-neon-green/30"
            >
              <Calendar className="mr-2 h-4 w-4 text-neon-green" />
              {format(formData.created_at, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-cyber-dark border-neon-green/30">
            <CalendarComponent
              mode="single"
              selected={formData.created_at}
              onSelect={(date) => date && updateField('created_at', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-neon-green/30 text-white"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          className="bg-neon-green hover:bg-neon-green/90 text-black"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Review"}
        </Button>
      </div>
    </div>
  );
}; 