import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import MatrixBackground from '@/components/home/MatrixBackground';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [userNotFoundDialog, setUserNotFoundDialog] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing again
    if (name === 'password') {
      setPasswordError('');
    }
  };

  // Check if user exists before attempting login
  const checkUserExists = async (email: string) => {
    try {
      // First check if the user exists by making a request to the backend
      const response = await fetch(`http://127.0.0.1:8000/api/check-email?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking user:', error);
      return null; // Return null on error to indicate we couldn't check
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError('');

    try {
      // First check if the user exists
      const userExists = await checkUserExists(formData.email);
      
      // If user doesn't exist, show dialog and stop login process
      if (userExists === false) {
        setUserNotFoundDialog(true);
        setIsLoading(false);
        return;
      }
      
      // If we couldn't determine if user exists, or user exists, proceed with login
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });

        // Redirect based on user role
        if (data.user.is_admin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        // If we get here, it's a password error (since we already checked if user exists)
        setPasswordError('Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cyber-dark">
      <MatrixBackground />
      
      <div className="container max-w-md z-10">
        <Card className="bg-cyber-dark/80 backdrop-blur-md border-neon-green/30">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-white font-mono">
              <span className="text-neon-green">CYBER</span> LOGIN
            </CardTitle>
            <CardDescription className="text-white/60">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-neon-green" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 p-2 bg-cyber-dark border border-neon-green/30 rounded-md text-white focus:border-neon-green focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-neon-green" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 p-2 bg-cyber-dark border ${passwordError ? 'border-red-500' : 'border-neon-green/30'} rounded-md text-white focus:border-neon-green focus:outline-none`}
                  />
                </div>
                {passwordError && (
                  <div className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {passwordError}
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Login <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-white/60 text-sm">
              <Link to="/forgot-password" className="text-white/60 hover:text-neon-green">
                Forgot password?
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* User Not Found Dialog */}
      <Dialog open={userNotFoundDialog} onOpenChange={setUserNotFoundDialog}>
        <DialogContent className="bg-cyber-dark border-neon-green/30 text-white max-w-[85vw] sm:max-w-md p-4 rounded-lg">
          <DialogHeader className="pb-2 space-y-1">
            <DialogTitle className="text-neon-green text-lg">User Doesn't Exist</DialogTitle>
            <DialogDescription className="text-white/70 text-sm">
              The email is not registered in our system.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-2">
            <Button 
              onClick={() => setUserNotFoundDialog(false)}
              className="bg-neon-green text-black hover:bg-neon-green/90 text-sm py-1 px-3 h-8"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login; 