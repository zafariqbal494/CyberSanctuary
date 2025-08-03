import { useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Image, Upload, Trash2, Info, AlertTriangle } from 'lucide-react';
import { Course } from '@/types';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CourseMediaSectionProps {
  formData: Partial<Course>;
  imageFile: File | null;
  imagePreview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

const CourseMediaSection = ({ 
  formData, 
  imageFile,
  imagePreview,
  onChange,
  onImageChange,
  onRemoveImage
}: CourseMediaSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageWarning, setImageWarning] = useState<string | null>(null);
  
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Custom image change handler with validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageWarning(null);
    
    if (file) {
      // Check file size (max 800KB)
      if (file.size > 800 * 1024) {
        setImageWarning(`Image size (${(file.size / 1024).toFixed(1)}KB) exceeds the recommended 800KB limit. This may slow down page loading.`);
      }
      
      // Check image dimensions
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        
        // Check aspect ratio
        const aspectRatio = img.width / img.height;
        if (Math.abs(aspectRatio - 16/9) > 0.1) {
          setImageWarning(`Image aspect ratio (${aspectRatio.toFixed(2)}) is not 16:9. This may cause visual inconsistencies.`);
        }
        
        // Check if image is too small
        if (img.width < 800 || img.height < 450) {
          setImageWarning(`Image resolution (${img.width}x${img.height}) is below the recommended 800x450px minimum.`);
        }
      };
      img.src = URL.createObjectURL(file);
      
      // Pass to the original handler
      onImageChange(e);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image_url" className="text-white/80 font-mono">
          Image URL
        </Label>
        <div className="relative mt-1">
          <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neon-green" />
          <Input
            id="image_url"
            name="image_url"
            value={formData.image_url || ''}
            onChange={onChange}
            placeholder="https://example.com/image.jpg"
            className="pl-10 bg-cyber-light border-neon-green/30 text-white"
          />
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="image" className="text-white/80 font-mono">
            Course Image
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-white/50 hover:text-neon-green">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>For best performance:</p>
                <ul className="list-disc pl-4 text-xs mt-1">
                  <li>Use WebP format for smaller file sizes</li>
                  <li>Keep images under 800KB</li>
                  <li>Use 16:9 aspect ratio (e.g., 800×450px)</li>
                  <li>Compress images before uploading</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="mt-1">
          <input
            type="file"
            id="image"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/webp,image/png,image/jpeg"
            className="hidden"
          />
          
          {imagePreview ? (
            <div className="relative">
              <ResponsiveImage 
                src={imagePreview} 
                alt="Course thumbnail preview" 
                width={800}
                height={450}
                aspectRatio="16/9"
                objectFit="cover"
                className="w-full h-auto max-h-48 rounded-md border border-neon-green/30"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={onRemoveImage}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-dashed border-neon-green/30 text-neon-green hover:bg-neon-green/10 flex items-center justify-center h-24"
              onClick={handleImageUploadClick}
            >
              <Upload className="h-5 w-5 mr-2" />
              Click to upload image
            </Button>
          )}
          
          <div className="flex justify-between items-start mt-1">
            <p className="text-xs text-white/50">
              Recommended: 800×450px (16:9). Max: 800KB. WebP preferred.
            </p>
            <p className="text-xs text-neon-green">
              {imageFile ? `${(imageFile.size / 1024).toFixed(1)}KB` : ''}
            </p>
          </div>
          
          {imageWarning && (
            <Alert variant="warning" className="mt-2 bg-yellow-900/20 border-yellow-600/30">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertTitle className="text-yellow-500 text-sm">Image Warning</AlertTitle>
              <AlertDescription className="text-xs text-yellow-400/80">
                {imageWarning}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseMediaSection; 