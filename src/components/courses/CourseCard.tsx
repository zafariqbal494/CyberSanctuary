import { Link } from 'react-router-dom';
import { Database, Search, Key, Lock, FileText, Network, ShoppingCart, Clock, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from '@/types';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { getImageUrl, generateSizes } from '@/utils/imageUtils';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
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

  // Define responsive sizes for the course card image
  const imageSizes = generateSizes({
    '(max-width: 640px)': '100vw',
    '(max-width: 768px)': '50vw',
    '(max-width: 1024px)': '33vw',
    default: '25vw'
  });

  return (
    <Card className="cyber-border bg-cyber-light h-full flex flex-col hover:translate-y-[-5px] transition-all duration-300">
      <CardContent className="pt-4 px-3 pb-0 flex-grow">
        {course.image_url ? (
          <div className="w-full aspect-video mb-3 rounded-md overflow-hidden relative bg-gradient-to-br from-cyber-dark to-cyber-darker border border-neon-green/20">
            <div className="absolute inset-0 opacity-30" style={{ 
              backgroundImage: 'radial-gradient(circle at 20% 150%, rgba(0, 255, 170, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% -20%, rgba(0, 255, 170, 0.15) 0%, transparent 55%)',
              mixBlendMode: 'overlay'
            }}></div>
            <ResponsiveImage 
              src={getImageUrl(course.image_url)}
              alt={course.name}
              width={640}
              height={360}
              aspectRatio="16/9"
              objectFit="cover"
              className="w-full h-full hover:scale-105 transition-transform duration-500"
              sizes={imageSizes}
              quality={85}
            />
          </div>
        ) : (
          <div className="w-full aspect-video mb-3 rounded-md overflow-hidden relative bg-gradient-to-br from-cyber-dark to-cyber-darker border border-neon-green/20 flex items-center justify-center">
            <div className="absolute inset-0 opacity-30" style={{ 
              backgroundImage: 'radial-gradient(circle at 20% 150%, rgba(0, 255, 170, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% -20%, rgba(0, 255, 170, 0.15) 0%, transparent 55%)',
              mixBlendMode: 'overlay'
            }}></div>
            <div className="z-10">
              {getIcon()}
            </div>
          </div>
        )}
        
        <h3 className="text-xl font-mono font-semibold mb-2">{course.name}</h3>
        <p className="text-white/70 text-sm mb-3">{course.shortDescription}</p>
        
        <div className="flex flex-row justify-evenly flex-wrap xs:flex-nowrap text-xs text-white/60 gap-2">
          <div className="flex items-center mb-2 xs:mb-0 border border-neon-green/30 bg-cyber-darker/50 px-2 py-1 rounded">
            <ShoppingCart className="h-3 w-3 text-neon-green mr-1" />
            <span>{course.purchases_count || 0} purchases</span>
          </div>
          
          <div className="flex items-center mb-2 xs:mb-0 border border-neon-green/30 bg-cyber-darker/50 px-2 py-1 rounded">
            <Clock className="h-3 w-3 text-neon-green mr-1" />
            <span>{course.duration}</span>
          </div>
          
          <div className="flex items-center mb-2 xs:mb-0 border border-neon-green/30 bg-cyber-darker/50 px-2 py-1 rounded">
            <MessageSquare className="h-3 w-3 text-neon-green mr-1" />
            <span>{course.reviews?.length || 0} reviews</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-3 px-3">
        <Link to={`/courses/${course.id}`} className="w-full">
          <Button variant="outline" className="btn-cyber w-full">
            View Course
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
