import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Save, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const ResetPasswordPage = () => {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (passwordData.password !== passwordData.password_confirmation) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match",
        variant: "destructive",
      });
      setSaving(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Handle not logged in case
        toast({
            title: "Authentication Error",
            description: "You must be logged in to change your password.",
            variant: "destructive",
        });
        setSaving(false);
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }
      
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
      
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully",
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Password Change Failed",
        description: error instanceof Error ? error.message : "Failed to change your password",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-mono font-bold text-white">
          Reset Your <span className="text-neon-green">Password</span>
        </h1>
        <Button
          variant="outline"
          className="bg-transparent text-neon-green border-neon-green/30 hover:bg-neon-green/10 hover:text-neon-green"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <Card className="bg-cyber-light border-neon-green/30 text-white">
        <CardHeader>
          <CardTitle className="text-lg font-mono flex items-center">
            <Lock className="h-5 w-5 text-neon-green mr-2" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-neon-green" />
                <input 
                  type="password" 
                  name="current_password"
                  placeholder="Enter your current password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full pl-10 p-2 rounded-md bg-cyber-dark border border-neon-green/30 text-white focus:border-neon-green focus:outline-none"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-neon-green" />
                <input 
                  type="password" 
                  name="password"
                  placeholder="Enter new password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full pl-10 p-2 rounded-md bg-cyber-dark border border-neon-green/30 text-white focus:border-neon-green focus:outline-none"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-neon-green" />
                <input 
                  type="password" 
                  name="password_confirmation"
                  placeholder="Confirm new password"
                  value={passwordData.password_confirmation}
                  onChange={handlePasswordChange}
                  required
                  className="w-full pl-10 p-2 rounded-md bg-cyber-dark border border-neon-green/30 text-white focus:border-neon-green focus:outline-none"
                />
              </div>
            </div>
            
            <Button 
              type="submit"
              className="bg-neon-green text-black hover:bg-neon-green/90"
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="mr-2 h-4 w-4" /> Update Password
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage; 