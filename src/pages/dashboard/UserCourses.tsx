import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface Course {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
  enrolled_at: string;
  progress: number;
}

const UserCourses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch enrolled courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/user/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to load your courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-mono font-bold text-white">
            My <span className="text-neon-green">Courses</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Continue your learning journey
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-neon-green" />
        <input
          type="text"
          placeholder="Search your courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 p-2 bg-cyber-dark border border-neon-green/30 rounded-md text-white focus:border-neon-green focus:outline-none"
        />
      </div>

      {loading ? (
        // Loading skeletons
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, index) => (
            <Card key={index} className="bg-cyber-light border-neon-green/30">
              <CardHeader className="pb-2">
                <Skeleton className="h-40 w-full rounded-md mb-2" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-8 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="bg-cyber-light border-neon-green/30 text-white overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img 
                  src={course.image_url || '/placeholder.svg'} 
                  alt={course.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-mono">{course.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/60 line-clamp-2 mb-2">{course.description}</p>
                <p className="text-xs text-white/60 mb-4">Enrolled on {formatDate(course.enrolled_at)}</p>
                
                {/* Progress bar */}
                <div className="w-full bg-cyber-dark h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-neon-green h-full" 
                    style={{ width: `${course.progress || 0}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-white/60">Progress</span>
                  <span className="text-xs text-neon-green">{course.progress || 0}%</span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-white/20 rounded-md">
          <BookOpen className="h-12 w-12 text-white/30 mx-auto mb-4" />
          <h3 className="text-lg font-mono text-white mb-2">No Courses Found</h3>
          {searchQuery ? (
            <p className="text-white/60 mb-4">No courses match your search. Try different keywords.</p>
          ) : (
            <p className="text-white/60 mb-4">You haven't enrolled in any courses yet.</p>
          )}
          <Button 
            variant="outline" 
            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
            onClick={() => navigate('/courses')}
          >
            Browse Courses
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserCourses; 