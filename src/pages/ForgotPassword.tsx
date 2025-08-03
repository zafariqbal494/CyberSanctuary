import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import MatrixBackground from '@/components/home/MatrixBackground';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        toast({
          title: "Email Sent",
          description: "Password reset link has been sent to your email",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send password reset email",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
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
              <span className="text-neon-green">FORGOT</span> PASSWORD
            </CardTitle>
            <CardDescription className="text-white/60">
              {!submitted 
                ? "Enter your email to receive a password reset link" 
                : "Check your email for the password reset link"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-neon-green" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 p-2 bg-cyber-dark border border-neon-green/30 rounded-md text-white focus:border-neon-green focus:outline-none"
                    />
                  </div>
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
                      Send Reset Link <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center text-white py-4">
                <p>A password reset link has been sent to {email}.</p>
                <p className="mt-2">Please check your inbox and follow the instructions in the email.</p>
                <Button 
                  onClick={() => navigate('/login')} 
                  className="mt-4 bg-neon-green text-black hover:bg-neon-green/90"
                >
                  <span className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                  </span>
                </Button>
              </div>
            )}
          </CardContent>
          
          {!submitted && (
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-center text-white/60 text-sm">
                Remember your password?{" "}
                <Link to="/login" className="text-neon-green hover:underline">
                  Back to Login
                </Link>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword; 