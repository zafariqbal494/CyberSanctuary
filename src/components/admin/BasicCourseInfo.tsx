import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Course } from '@/types';
import { BookOpen } from 'lucide-react';

interface BasicCourseInfoProps {
  formData: Partial<Course>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicCourseInfo = ({ formData, onChange }: BasicCourseInfoProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-white/80 font-mono">
          Course Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={onChange}
          placeholder="e.g. Advanced Penetration Testing"
          className="bg-cyber-light border-neon-green/30 text-white mt-1"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="shortDescription" className="text-white/80 font-mono">
          Short Description <span className="text-red-500">*</span>
        </Label>
        <Input
          id="shortDescription"
          name="shortDescription"
          value={formData.shortDescription || ''}
          onChange={onChange}
          placeholder="Brief description for course cards"
          className="bg-cyber-light border-neon-green/30 text-white mt-1"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description" className="text-white/80 font-mono">
          Full Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={onChange}
          placeholder="Detailed course description..."
          className="bg-cyber-light border-neon-green/30 text-white mt-1 h-24"
          required
        />
      </div>
    </div>
  );
};

export default BasicCourseInfo; 