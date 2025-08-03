import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Course } from '@/types';
import { Plus, X } from 'lucide-react';

interface CourseSpecificationsManagerProps {
  formData: Partial<Course>;
  onUpdate: (specifications: string[]) => void;
}

const CourseSpecificationsManager = ({ 
  formData, 
  onUpdate 
}: CourseSpecificationsManagerProps) => {
  const [newSpec, setNewSpec] = useState('');
  
  const addSpecification = () => {
    if (newSpec.trim()) {
      const updatedSpecs = [...(formData.specifications || []), newSpec.trim()];
      onUpdate(updatedSpecs);
      setNewSpec('');
    }
  };
  
  const removeSpecification = (index: number) => {
    const updatedSpecs = [...(formData.specifications || [])];
    updatedSpecs.splice(index, 1);
    onUpdate(updatedSpecs);
  };

  return (
    <div>
      <Label className="text-white/80 font-mono mb-2 block">
        Specifications
      </Label>
      <div className="flex flex-col gap-2 mb-2">
        {formData.specifications && formData.specifications.map((spec, index) => (
          <div 
            key={index}
            className="bg-cyber-light px-3 py-2 rounded-md flex items-center justify-between border border-neon-green/30"
          >
            <span className="text-xs">{spec}</span>
            <button 
              type="button" 
              onClick={() => removeSpecification(index)}
              className="text-white/50 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newSpec}
          onChange={(e) => setNewSpec(e.target.value)}
          placeholder="Add a specification"
          className="bg-cyber-light border-neon-green/30 text-white"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addSpecification();
            }
          }}
        />
        <Button 
          type="button" 
          variant="outline" 
          className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
          onClick={addSpecification}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CourseSpecificationsManager; 