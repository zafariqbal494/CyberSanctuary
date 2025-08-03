import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import MatrixBackground from '@/components/home/MatrixBackground';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    password: '',
    password_confirmation: '',
    token: searchParams.get('token') || '',
  });

  useEffect(() => {
    if (!formData.token || !formData.email) {
      toast({
        title: "Invalid Reset Link",
        description: "The password reset link is invalid or expired.",
        variant: "destructive",
      });
    }
  }, [formData.token, formData.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been reset successfully.",
        });
        navigate('/login');
      } else {
        toast({
          title: "Reset Failed",
          description: data.error || "Failed to reset password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
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
              <span className="text-neon-green">RESET</span> PASSWORD
            </CardTitle>
            <CardDescription className="text-white/60">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    readOnly
                    className="w-full pl-10 p-2 bg-cyber-dark border border-neon-green/30 rounded-md text-white/50 focus:border-neon-green focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-neon-green" />
                  <input
                    type="password"
                    name="password"
                    placeholder="New Password"
                    value={formData.password}
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
                    name="password_confirmation"
                    placeholder="Confirm New Password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 p-2 bg-cyber-dark border border-neon-green/30 rounded-md text-white focus:border-neon-green focus:outline-none"
                  />
                </div>
              </div>
              
              <input type="hidden" name="token" value={formData.token} />
              
              <Button 
                type="submit" 
                className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                disabled={isLoading || !formData.token || !formData.email}
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
                    Reset Password <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-white/60 text-sm">
              Remember your password?{" "}
              <Link to="/login" className="text-neon-green hover:underline">
                Back to Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword; 