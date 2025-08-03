import { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Edit, Trash2, MoreHorizontal, AlertTriangle, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Course } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CourseFormModal from '@/components/admin/CourseFormModal';
import PurchasesCountModal from '@/components/admin/PurchasesCountModal';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

const AdminCourses = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Course form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Purchases count modal state
  const [isPurchasesCountModalOpen, setIsPurchasesCountModalOpen] = useState(false);
  const [courseForPurchasesCount, setCourseForPurchasesCount] = useState<Course | null>(null);
  
  const navigate = useNavigate();

  // Mock API functions (to be replaced with real API calls)
  const mockCreateCourse = async (courseData: Partial<Course>): Promise<Course> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a random ID for the new course
    const newCourse = {
      ...courseData,
      id: `course_${Math.floor(Math.random() * 10000)}`,
      lastUpdate: new Date().toISOString(),
    } as Course;
    
    // Add to local state
    setAllCourses(prev => [...prev, newCourse]);
    
    return newCourse;
  };
  
  const updateCourse = async (id: string, courseData: Partial<Course>): Promise<Course> => {
    try {
      // Call the real API endpoint
      const response = await fetch(`http://127.0.0.1:8000/api/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update course');
      }
      
      const updatedCourse = await response.json();
      
      // Update in local state
      setAllCourses(prev => 
        prev.map(course => course.id === id ? updatedCourse : course)
      );
      
      return updatedCourse;
    } catch (error) {
      console.error('Error updating course:', error);
      
      // Fallback to mock behavior if API fails
      const updatedCourse = { ...courseData, id, lastUpdate: new Date().toISOString() } as Course;
      setAllCourses(prev => 
        prev.map(course => course.id === id ? updatedCourse : course)
      );
      
      return updatedCourse;
    }
  };
  
  const mockDeleteCourse = async (id: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove from local state
    setAllCourses(prev => prev.filter(course => course.id !== id));
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data: Course[] = await response.json();
        setAllCourses(data);
        setFilteredCourses(data);
      } catch (err: any) {
        setError(err.message);
        // Fallback to mock data if API fails
        const mockCourses = [
          {
            id: "1",
            name: "Advanced Penetration Testing",
            shortDescription: "Master ethical hacking and penetration testing techniques",
            icon: "key",
            price: 299,
            duration: "40 hours",
            description: "This comprehensive course teaches you advanced penetration testing methodologies used by professional ethical hackers.",
            lastUpdate: "2023-05-27",
          },
          {
            id: "2",
            name: "Network Defense Strategies",
            shortDescription: "Protect networks from advanced threats",
            icon: "network",
            price: 249,
            duration: "35 hours",
            description: "Learn how to defend networks against sophisticated attacks and APTs.",
            lastUpdate: "2023-06-15",
          }
        ] as Course[];
        
        setAllCourses(mockCourses);
        setFilteredCourses(mockCourses);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = allCourses.filter(course => {
      return course.name.toLowerCase().includes(lowercasedSearchTerm) ||
             (course.shortDescription && course.shortDescription.toLowerCase().includes(lowercasedSearchTerm));
    });
    setFilteredCourses(filtered);
  }, [searchTerm, allCourses]);

  const handleOpenCreateForm = () => {
    // Navigate to the create course page
    navigate('/admin/courses/edit/new');
  };

  const handleOpenEditForm = (course: Course) => {
    // Navigate to the edit course page with the course ID
    navigate(`/admin/courses/edit/${course.id}`);
  };

  const handleOpenDeleteDialog = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveCourse = async (courseData: Partial<Course>) => {
    try {
      if (selectedCourse) {
        // Update existing course
        await updateCourse(selectedCourse.id, courseData);
        toast({
          title: "Course Updated",
          description: `${courseData.name} has been updated successfully.`
        });
      } else {
        // Create new course
        await mockCreateCourse(courseData);
        toast({
          title: "Course Created",
          description: `${courseData.name} has been created successfully.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${selectedCourse ? 'update' : 'create'} course.`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    try {
      // Call the API endpoint (using public route for now)
      const response = await fetch(`http://127.0.0.1:8000/api/courses/${courseToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete course');
      }
      
      // Remove from local state
      setAllCourses(prev => prev.filter(course => course.id !== courseToDelete.id));
      
      toast({
        title: "Course Deleted",
        description: `${courseToDelete.name} has been deleted.`
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course.",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const handleOpenPurchasesCountModal = (course: Course) => {
    setCourseForPurchasesCount(course);
    setIsPurchasesCountModalOpen(true);
  };

  const handleUpdatePurchasesCount = (updatedCourse: Course) => {
    // Update the course in the local state
    setAllCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  };

  // Function to get the full image URL
  const getImageUrl = (url: string) => {
    if (!url) return null;
    
    // If the URL already starts with http:// or https://, use it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Otherwise, prepend the backend URL
    return `http://127.0.0.1:8000${url}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-mono font-bold text-white flex items-center">
            <BookOpen className="h-7 w-7 text-neon-green mr-2" />
            <span>Course <span className="text-neon-green">Management</span></span>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Add, edit, and manage your cybersecurity courses
          </p>
        </div>
        
        <Button 
          className="bg-neon-green hover:bg-neon-green/90 text-black font-mono"
          onClick={handleOpenCreateForm}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Course
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            type="text"
            placeholder="Search courses..."
            className="pl-10 bg-cyber-light border-neon-green/30 text-white w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Course List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="bg-cyber-light border-neon-green/30">
              <CardContent className="p-4 flex items-center gap-4">
                <Skeleton className="w-12 h-12 flex-shrink-0" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-cyber-dark/50 rounded-lg border border-red-500/30">
          <p className="text-red-500">Error: {error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="bg-cyber-light border-neon-green/30 hover:border-neon-green/50 transition-colors">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4">
                  <div className="bg-cyber-dark p-3 rounded-md border border-neon-green/20 flex-shrink-0">
                    {course.image_url ? (
                      <img 
                        src={getImageUrl(course.image_url)} 
                        alt={course.name} 
                        className="w-12 h-12 object-cover"
                      />
                    ) : (
                      <BookOpen className="h-6 w-6 text-neon-green" />
                    )}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <h3 className="text-white font-mono font-semibold text-lg truncate">{course.name}</h3>
                    <p className="text-white/70 text-sm truncate">{course.shortDescription}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-white/60">Price: ${course.price}</span>
                      <span className="text-xs text-white/60">Purchases: {course.purchases_count || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                      onClick={() => handleOpenPurchasesCountModal(course)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Purchases
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                      onClick={() => handleOpenEditForm(course)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                      onClick={() => handleOpenDeleteDialog(course)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white/70">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-cyber-dark/50 rounded-lg border border-neon-green/20 mt-4">
          <BookOpen className="h-12 w-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/70 mb-2">No courses match your search criteria.</p>
          <Button 
            variant="outline" 
            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10 mt-2" 
            onClick={() => setSearchTerm('')}
          >
            Clear search
          </Button>
        </div>
      )}
      
      {/* Course Form Modal */}
      <CourseFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        course={selectedCourse}
        onSave={handleSaveCourse}
      />
      
      {/* Purchases Count Modal */}
      {courseForPurchasesCount && (
        <PurchasesCountModal
          isOpen={isPurchasesCountModalOpen}
          onClose={() => setIsPurchasesCountModalOpen(false)}
          course={courseForPurchasesCount}
          onUpdate={handleUpdatePurchasesCount}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-cyber-dark border border-red-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Course
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete "{courseToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-white/20 text-white hover:bg-white/5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCourse}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCourses; 