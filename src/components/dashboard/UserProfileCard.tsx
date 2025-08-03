import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Edit, KeyRound } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { UserData, formatDate, userService } from '@/services/userService';

interface UserProfileCardProps {
  userData: UserData | null;
  loading: boolean;
  onProfileUpdate: (updatedUser: UserData) => void;
}

const UserProfileCard = ({ userData, loading, onProfileUpdate }: UserProfileCardProps) => {
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    username: userData?.username || '',
  });

  // Update form data when userData changes
  if (userData && (userData.name !== formData.name || userData.username !== formData.username)) {
    setFormData({
      name: userData.name,
      username: userData.username,
    });
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const startEditing = (field: string) => {
    setEditingField(field);
  };
  
  const saveField = async (field: string) => {
    try {
      const value = formData[field as keyof typeof formData];
      const updatedUser = await userService.updateProfile(field, value);
      
      onProfileUpdate(updatedUser);
      
      toast({
        title: "Updated Successfully",
        description: `Your ${field} has been updated.`,
      });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : `Failed to update ${field}`,
        variant: "destructive",
      });
    } finally {
      setEditingField(null);
    }
  };
  
  const cancelEditing = () => {
    // Reset form data to current values
    if (userData) {
      setFormData({
        name: userData.name,
        username: userData.username,
      });
    }
    setEditingField(null);
  };

  return (
    <Card className="bg-cyber-light border-neon-green/30 text-white">
      <CardHeader>
        <CardTitle className="text-lg font-mono flex items-center">
          <User className="h-5 w-5 text-neon-green mr-2" />
          User Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-10 w-32 mt-4" />
          </>
        ) : (
          <div className="space-y-6">
            {/* Username */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-medium text-white/70">Username</p>
                {editingField === 'username' ? (
                  <input 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 rounded-md bg-cyber-dark border border-neon-green/30 text-white focus:border-neon-green focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <p className="text-white">{userData?.username}</p>
                )}
              </div>
              <div>
                {editingField === 'username' ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                      onClick={() => saveField('username')}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                    onClick={() => startEditing('username')}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                )}
              </div>
            </div>
            
            {/* Name */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-medium text-white/70">Name</p>
                {editingField === 'name' ? (
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 rounded-md bg-cyber-dark border border-neon-green/30 text-white focus:border-neon-green focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <p className="text-white">{userData?.name}</p>
                )}
              </div>
              <div>
                {editingField === 'name' ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                      onClick={() => saveField('name')}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                    onClick={() => startEditing('name')}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                )}
              </div>
            </div>
            
            {/* Email */}
            <div className="border-b border-white/10 pb-4">
              <p className="text-sm font-medium text-white/70">Email Address</p>
              <p className="text-white">{userData?.email}</p>
            </div>
            
            {/* Enrollment Date */}
            {userData?.created_at && (
              <div className="border-b border-white/10 pb-4">
                <p className="text-sm font-medium text-white/70">Member Since</p>
                <p className="text-white">{formatDate(userData.created_at)}</p>
              </div>
            )}
            
            {/* Reset Password Button */}
            <div className="pt-4">
              <Button 
                variant="outline" 
                className="w-full border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                onClick={() => navigate('/dashboard/reset-password')}
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Reset Password
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfileCard; 