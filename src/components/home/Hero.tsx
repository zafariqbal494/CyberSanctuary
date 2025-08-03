
import { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';

// Lazy load the MatrixBackground component
const MatrixBackground = lazy(() => import('./MatrixBackground'));

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className="relative h-screen flex items-center justify-center px-4 overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 bg-cyber-dark" />}>
        <MatrixBackground />
      </Suspense>
      
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark z-10"></div>
      
      <div className="relative z-20 max-w-5xl mx-auto text-center transform transition-all duration-1000 ease-out" 
           style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(2rem)' }}>
        <h1 className="font-mono text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
          <span className="text-white">Master Ethical Hacking with</span><br />
          <span className="text-neon-green animate-glow">Expert-Led Content</span>
        </h1>
        
        <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto mb-10">
          Break into the world of ethical hacking with hands-on training built by professionals.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/courses" className="btn-cyber text-lg px-8 py-3 animate-pulse-neon">
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
