import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Login Failed",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: username.includes('@') ? username : 'admin@cybersanctuary.com', // Use email if username contains @, otherwise use default admin email
          username: username,
          password,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error('Login failed. Please check your credentials.');
      }
      
      const data = await response.json();
      
      // Check if user is admin
      if (!data.user.is_admin) {
        throw new Error('You do not have admin privileges');
      }
      
      // Store auth token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.name}!`,
      });
      
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-neon-green/10 p-4 rounded-full border border-neon-green/30">
              <Shield className="h-12 w-12 text-neon-green" />
            </div>
          </div>
          <h1 className="text-2xl font-mono font-bold text-white">
            Admin <span className="text-neon-green">Login</span>
          </h1>
          <p className="text-white/60 text-sm mt-2">
            Access the CyberSanctuary admin panel
          </p>
        </div>
        
        <div className="bg-cyber-darker border border-neon-green/30 rounded-lg p-6">
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-white/80 font-mono">
                  Username or Email
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neon-green" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username or email"
                    className="pl-10 bg-cyber-dark border-neon-green/30 text-white"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="password" className="text-white/80 font-mono">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neon-green" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 bg-cyber-dark border-neon-green/30 text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-neon-green hover:bg-neon-green/90 text-black font-mono mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Login to Admin Panel"}
              </Button>
            </div>
          </form>
          
          <div className="mt-4 pt-4 border-t border-neon-green/10 text-center">
            <p className="text-white/50 text-xs mb-1">
              Default admin credentials:
            </p>
            <p className="text-white/70 text-xs">
              Username: <span className="text-neon-green">admin</span>
            </p>
            <p className="text-white/70 text-xs">
              Email: <span className="text-neon-green">admin@cybersanctuary.com</span>
            </p>
            <p className="text-white/70 text-xs">
              Password: <span className="text-neon-green">admin1436</span> (or your custom password)
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-neon-green hover:underline text-sm">
            Return to main site
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;