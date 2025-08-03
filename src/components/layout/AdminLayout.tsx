import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, BookOpen, Users, CreditCard, Settings, ChevronRight, Menu, X, LogOut, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check if token exists
        const token = localStorage.getItem('token');
        const adminAuth = localStorage.getItem('adminAuth');
        
        if (!token || !adminAuth) {
          throw new Error('Not authenticated');
        }
        
        // Verify token with backend
        const response = await fetch('http://127.0.0.1:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Invalid token');
        }
        
        const userData = await response.json();
        
        // Check if user is admin
        if (!userData.is_admin) {
          throw new Error('Not an admin user');
        }
        
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication error:', error);
        // Clear invalid auth data
        localStorage.removeItem('token');
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('user');
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyAuth();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Call logout API
        await fetch('http://127.0.0.1:8000/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth data regardless of API success
      localStorage.removeItem('token');
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('user');
      
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
      
      navigate('/admin/login');
    }
  };
  
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Courses', href: '/admin/courses', icon: BookOpen },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Shield className="h-12 w-12 text-neon-green mx-auto mb-4" />
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
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md bg-cyber-light border border-neon-green/30 text-white"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-cyber-darker border-r border-neon-green/20 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-neon-green/20">
          <Link to="/admin" className="flex items-center gap-2 group">
            <Shield className="h-6 w-6 text-neon-green group-hover:animate-pulse" />
            <span className="font-mono font-bold text-lg text-white">
              ADMIN<span className="text-neon-green">PANEL</span>
            </span>
          </Link>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-mono transition-colors",
                    isActive(item.href)
                      ? "bg-neon-green/10 text-neon-green border-l-2 border-neon-green"
                      : "text-white/70 hover:bg-cyber-dark hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  {isActive(item.href) && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-cyber-dark p-3 rounded-md border border-neon-green/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-neon-green/10 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-neon-green" />
                </div>
                <div>
                  <p className="text-white text-sm font-mono">{user?.name || 'Admin User'}</p>
                  <p className="text-white/50 text-xs">{user?.email || 'admin@cybersanctuary.com'}</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/50 hover:text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className={cn(
        "transition-all duration-200 ease-in-out",
        "lg:ml-64" // Always offset on large screens
      )}>
        <main className="min-h-screen pt-16 lg:pt-0">
          <Outlet />
        </main>
      </div>
      
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout; 