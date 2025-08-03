import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Course } from '@/types';
import { BookOpen } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import the form section components
import BasicCourseInfo from './BasicCourseInfo';
import CourseMediaSection from './CourseMediaSection';
import CourseMetadataSection from './CourseMetadataSection';
import CourseSpecificationsManager from './CourseSpecificationsManager';
import FormActionButtons from './FormActionButtons';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: Course | null;
  onSave: (course: Partial<Course>) => void;
}

const CourseFormModal = ({ isOpen, onClose, course, onSave }: CourseFormModalProps) => {
  const isEditing = !!course;
  const [activeTab, setActiveTab] = useState("basic");
  
  const [formData, setFormData] = useState<Partial<Course>>({
    name: '',
    shortDescription: '',
    description: '',
    icon: 'database',
    image_url: '',
    price: 0,
    lastUpdate: new Date().toISOString().split('T')[0],
    duration: '',
    specifications: [],
    topics: [],
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastUpdateDate, setLastUpdateDate] = useState<Date | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // If editing, populate form with course data
  useEffect(() => {
    if (course) {
      // Convert ISO string to Date object for the date picker
      const lastUpdateDate = course.lastUpdate ? new Date(course.lastUpdate) : new Date();
      setLastUpdateDate(lastUpdateDate);
      
      setFormData({
        name: course.name || '',
        shortDescription: course.shortDescription || '',
        description: course.description || '',
        icon: course.icon || 'database',
        image_url: course.image_url || '',
        price: course.price || 0,
        lastUpdate: course.lastUpdate || new Date().toISOString().split('T')[0],
        duration: course.duration || '',
        specifications: course.specifications || [],
        topics: course.topics || [],
      });
      
      // Set image preview if course has an image
      if (course.image_url) {
        setImagePreview(course.image_url);
      } else {
        setImagePreview(null);
      }
    } else {
      // Reset form if creating new course
      const currentDate = new Date();
      setLastUpdateDate(currentDate);
      
      setFormData({
        name: '',
        shortDescription: '',
        description: '',
        icon: 'database',
        image_url: '',
        price: 0,
        lastUpdate: currentDate.toISOString().split('T')[0],
        duration: '',
        specifications: [],
        topics: [],
      });
      
      setImagePreview(null);
      setImageFile(null);
    }
  }, [course, isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData({ ...formData, price: isNaN(value) ? 0 : value });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setLastUpdateDate(date);
      // Format the date in a MySQL-compatible format (YYYY-MM-DD)
      const formattedDate = date.toISOString().split('T')[0];
      setFormData({ ...formData, lastUpdate: formattedDate });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image_url: '' });
  };
  
  const updateSpecifications = (specifications: string[]) => {
    setFormData({ ...formData, specifications });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.shortDescription || !formData.description) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData object for file upload
      if (imageFile) {
        const formDataObj = new FormData();
        
        // Add all form fields to FormData
        Object.entries(formData).forEach(([key, value]) => {
          if (key === 'specifications' || key === 'topics') {
            // Handle arrays by converting to JSON string
            if (value) {
              formDataObj.append(key, JSON.stringify(value));
            }
          } else if (value !== null && value !== undefined) {
            // Handle all other fields
            formDataObj.append(key, String(value));
          }
        });
        
        // Add the image file
        formDataObj.append('image', imageFile);
        
        // Pass the FormData object to parent component
        onSave(formDataObj as unknown as Partial<Course>);
      } else {
        // No image file, pass the regular form data
        // Make sure arrays are properly handled
        const processedData = { ...formData };
        
        // Ensure specifications and topics are arrays
        if (processedData.specifications && !Array.isArray(processedData.specifications)) {
          processedData.specifications = [];
        }
        
        if (processedData.topics && !Array.isArray(processedData.topics)) {
          processedData.topics = [];
        }
        
        onSave(processedData);
      }
      
      toast({
        title: isEditing ? "Course Updated" : "Course Created",
        description: `Successfully ${isEditing ? 'updated' : 'created'} "${formData.name}"`,
      });
      
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} course`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cyber-dark border border-neon-green/30 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-mono text-white flex items-center">
            <BookOpen className="h-5 w-5 text-neon-green mr-2" />
            {isEditing ? 'Edit Course' : 'Create New Course'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="mt-0">
              <BasicCourseInfo 
                formData={formData}
                onChange={handleChange}
              />
            </TabsContent>
            
            <TabsContent value="media" className="mt-0">
              <CourseMediaSection 
                formData={formData}
                imageFile={imageFile}
                imagePreview={imagePreview}
                onChange={handleChange}
                onImageChange={handleImageChange}
                onRemoveImage={handleRemoveImage}
              />
            </TabsContent>
            
            <TabsContent value="metadata" className="mt-0">
              <CourseMetadataSection 
                formData={formData}
                lastUpdateDate={lastUpdateDate}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
                onPriceChange={handlePriceChange}
                onDateSelect={handleDateSelect}
              />
            </TabsContent>
            
            <TabsContent value="specs" className="mt-0">
              <CourseSpecificationsManager 
                formData={formData}
                onUpdate={updateSpecifications}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                const currentIndex = ["basic", "media", "metadata", "specs"].indexOf(activeTab);
                if (currentIndex > 0) {
                  setActiveTab(["basic", "media", "metadata", "specs"][currentIndex - 1]);
                }
              }}
              disabled={activeTab === "basic"}
            >
              Previous
            </Button>
            
            {activeTab !== "specs" ? (
              <Button 
                type="button" 
                onClick={() => {
                  const currentIndex = ["basic", "media", "metadata", "specs"].indexOf(activeTab);
                  if (currentIndex < 3) {
                    setActiveTab(["basic", "media", "metadata", "specs"][currentIndex + 1]);
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <FormActionButtons 
                onCancel={onClose}
                isSubmitting={isSubmitting}
                isEditing={isEditing}
              />
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseFormModal; 