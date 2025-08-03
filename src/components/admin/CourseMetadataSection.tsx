import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { Course } from '@/types';

interface CourseMetadataSectionProps {
  formData: Partial<Course>;
  lastUpdateDate: Date | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateSelect: (date: Date | undefined) => void;
}

const CourseMetadataSection = ({
  formData,
  lastUpdateDate,
  onChange,
  onSelectChange,
  onPriceChange,
  onDateSelect
}: CourseMetadataSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="icon" className="text-white/80 font-mono">
            Icon
          </Label>
          <Select 
            value={formData.icon} 
            onValueChange={(value) => onSelectChange('icon', value)}
          >
            <SelectTrigger className="bg-cyber-light border-neon-green/30 text-white mt-1">
              <SelectValue placeholder="Select icon" />
            </SelectTrigger>
            <SelectContent className="bg-cyber-dark border-neon-green/30 text-white">
              <SelectItem value="database">Database</SelectItem>
              <SelectItem value="network">Network</SelectItem>
              <SelectItem value="search">Search</SelectItem>
              <SelectItem value="key">Key</SelectItem>
              <SelectItem value="lock">Lock</SelectItem>
              <SelectItem value="file-lock">File Lock</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="price" className="text-white/80 font-mono">
            Price ($) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={onPriceChange}
            placeholder="e.g. 299"
            className="bg-cyber-light border-neon-green/30 text-white mt-1"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="duration" className="text-white/80 font-mono">
          Duration <span className="text-red-500">*</span>
        </Label>
        <Input
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={onChange}
          placeholder="e.g. 40 hours"
          className="bg-cyber-light border-neon-green/30 text-white mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="lastUpdate" className="text-white/80 font-mono">
          Last Update Date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="lastUpdate"
              variant="outline"
              className="w-full justify-start text-left font-normal bg-cyber-light border-neon-green/30 text-white mt-1"
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-neon-green" />
              {lastUpdateDate ? (
                format(lastUpdateDate, "MMMM d, yyyy")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-cyber-dark border-neon-green/30">
            <Calendar
              mode="single"
              selected={lastUpdateDate}
              onSelect={onDateSelect}
              initialFocus
              className="bg-cyber-dark text-white"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default CourseMetadataSection; 