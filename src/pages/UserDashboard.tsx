import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

// Import extracted components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import EnrolledCoursesList from '@/components/dashboard/EnrolledCoursesList';
import UserProfileCard from '@/components/dashboard/UserProfileCard';

// Import user service
import { userService, UserDashboardData, UserData } from '@/services/userService';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<UserDashboardData>({
    user: {
      id: 0,
      name: '',
      email: '',
      username: '',
      created_at: '',
    },
    enrolledCourses: [],
  });

  // Fetch user data and enrolled courses
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const data = await userService.fetchUserDashboardData();
      setDashboardData(data);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  // Handle user profile update
  const handleProfileUpdate = (updatedUser: UserData) => {
    setDashboardData(prev => ({
      ...prev,
      user: updatedUser
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader 
        title="My Dashboard" 
        subtitle="Manage your courses and profile" 
      />

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-cyber-dark border border-neon-green/20">
          <TabsTrigger value="courses" className="data-[state=active]:bg-neon-green/10 data-[state=active]:text-neon-green">
            My Courses
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-neon-green/10 data-[state=active]:text-neon-green">
            Profile Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="mt-6">
          <EnrolledCoursesList 
            courses={dashboardData.enrolledCourses} 
            loading={loading} 
          />
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <UserProfileCard 
            userData={dashboardData.user} 
            loading={loading} 
            onProfileUpdate={handleProfileUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard; 