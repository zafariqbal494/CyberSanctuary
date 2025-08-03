import { Calendar, Network, Database, Search, Key, Lock, FileText } from 'lucide-react';
import { Course } from '@/types';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { getImageUrl, generateSizes } from '@/utils/imageUtils';

interface CourseHeaderProps {
  course: Course;
}

export const CourseHeader = ({ course }: CourseHeaderProps) => {
  // Function to get the icon based on course.icon
  const getIcon = () => {
    switch(course.icon) {
      case 'network': return <Network className="h-6 w-6 text-neon-green" />;
      case 'database': return <Database className="h-6 w-6 text-neon-green" />;
      case 'search': return <Search className="h-6 w-6 text-neon-green" />;
      case 'key': return <Key className="h-6 w-6 text-neon-green" />;
      case 'lock': return <Lock className="h-6 w-6 text-neon-green" />;
      case 'file-lock': return <FileText className="h-6 w-6 text-neon-green" />;
      default: return <Database className="h-6 w-6 text-neon-green" />;
    }
  };

  // Check if the update was recent (within the last 30 days)
  const isRecentlyUpdated = course.lastUpdate ? 
    (new Date().getTime() - new Date(course.lastUpdate).getTime()) / (1000 * 60 * 60 * 24) <= 30 
    : false;

  // Define responsive sizes for the course header image
  const imageSizes = generateSizes({
    '(max-width: 768px)': '100vw',
    default: '288px'
  });

  return (
    <div className="flex flex-col md:flex-row items-start gap-2 mb-2 md:mb-5">
      {course.image_url ? (
        <div className="w-full h-auto md:w-72 md:h-40 overflow-hidden rounded border border-neon-green/30 bg-cyber-dark-light flex items-center justify-center">
          <ResponsiveImage 
            src={getImageUrl(course.image_url)}
            alt={course.name}
            width={288}
            height={160}
            aspectRatio="16/9"
            objectFit="cover"
            priority
            className="w-full h-full"
            sizes={imageSizes}
            quality={90}
          />
        </div>
      ) : (
        <div className="bg-cyber-light p-3 md:p-4 rounded-md border border-neon-green/30 w-16 h-16 md:w-auto md:h-auto flex items-center justify-center">
          {getIcon()}
        </div>
      )}
      <div className="flex-1">
        <h1 className="text-2xl md:text-3xl font-mono font-bold mb-3">{course.name}</h1>
        
        {course.lastUpdate && (
          <div className="inline-flex items-center backdrop-filter backdrop-blur-md bg-gradient-to-r from-neon-green/5 to-black/30 border-l-[3px] border-neon-green rounded-md px-4 py-2 shadow-md shadow-neon-green/5 hover:shadow-neon-green/15 transition-all duration-300 hover:translate-x-0.5 group animate-fadeIn relative">
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-neon-green/50 rounded-full blur-sm"></div>
            <div className="bg-neon-green/15 rounded-full p-1.5 mr-3">
              <Calendar className="h-4 w-4 text-neon-green group-hover:text-neon-green transition-colors duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-white leading-tight mb-0.5">
                {new Date(course.lastUpdate).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              {isRecentlyUpdated && (
                <span className="text-[11px] text-neon-green uppercase tracking-widest font-medium">Recently Updated</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 