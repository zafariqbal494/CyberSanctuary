import { useState, useEffect } from 'react';
import { Course } from '@/types';
import CourseCard from '@/components/courses/CourseCard';
import { Input } from "@/components/ui/input";
import { Search, GraduationCap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Courses = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
             course.shortDescription.toLowerCase().includes(lowercasedSearchTerm);
    });
    setFilteredCourses(filtered);
  }, [searchTerm, allCourses]);

  return (
    <div className="container mx-auto px-4 py-5">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-mono font-bold mb-4">
          Cybersecurity <span className="text-neon-green">Courses</span>
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Browse our collection of professional-grade training courses designed for ethical hackers and security researchers.
        </p>
      </div>
      
      <div className="mb-8 flex flex-col md:flex-row items-center justify-end">
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
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[225px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">
          <p>Error: {error}</p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <GraduationCap className="h-16 w-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/70 mb-2">No courses match your search criteria.</p>
          <button 
            className="text-neon-green hover:underline" 
            onClick={() => {
              setSearchTerm('');
            }}
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

export default Courses;
