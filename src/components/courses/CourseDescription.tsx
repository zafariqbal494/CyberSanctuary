import { Course } from '@/types';

interface CourseDescriptionProps {
  course: Course;
}

export const CourseDescription = ({ course }: CourseDescriptionProps) => {
  return (
    <>
      <p className="text-white/80 mb-5 md:mb-6 text-base md:text-lg mt-6">{course.description}</p>
      
      {course.specifications && Array.isArray(course.specifications) && course.specifications.length > 0 && (
        <>
          <h2 className="text-lg md:text-xl font-mono font-semibold mb-3 md:mb-4">Specifications:</h2>
          <ul className="space-y-2 mb-6 md:mb-8">
            {course.specifications.map((spec, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 bg-neon-green rounded-full" />
                <span className="text-white/80 text-sm md:text-base">{spec}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}; 