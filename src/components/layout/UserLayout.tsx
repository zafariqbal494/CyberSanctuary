import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const UserLayout = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate('/login');
        return;
      }
      
      try {
        // Verify token with backend
        const response = await fetch('http://127.0.0.1:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token is invalid
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyAuth();
  }, [navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <User className="h-12 w-12 text-neon-green mx-auto mb-4" />
          </div>
          <p className="text-white/70 text-sm">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Don't render anything if not authenticated
  }
  
  return (
    <div className="min-h-screen bg-cyber-dark">
      <main className="h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout; 