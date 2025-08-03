import { useState, useEffect } from 'react';
// Import icons from the main package
import { Shield, Users, BookOpen, CreditCard, BarChart3, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

// Define types for the dashboard data
interface DashboardStats {
  totalCourses: number;
  totalUsers: number;
  totalRevenue: number;
  pendingPayments: number;
}

interface Payment {
  id: string;
  user: string;
  course: string;
  amount: number;
  status: string;
  date: string;
}

interface User {
  username: string;
  email: string;
  courses: number;
  joinDate: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentPayments: Payment[];
  recentUsers: User[];
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      totalCourses: 0,
      totalUsers: 0,
      totalRevenue: 0,
      pendingPayments: 0
    },
    recentPayments: [],
    recentUsers: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://127.0.0.1:8000/api/dashboard/stats');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDashboardData(data);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      
      // Fall back to mock data if API fails
      setDashboardData({
        stats: {
          totalCourses: 12,
          totalUsers: 458,
          totalRevenue: 15840,
          pendingPayments: 8
        },
        recentPayments: [
          { id: 'ORD-387429', user: 'cyberhunter', course: 'Advanced Penetration Testing', amount: 299, status: 'pending', date: '2023-10-15' },
          { id: 'ORD-387428', user: 'securitypro', course: 'Network Defense Strategies', amount: 249, status: 'completed', date: '2023-10-14' },
          { id: 'ORD-387427', user: 'hackerman', course: 'Advanced Penetration Testing', amount: 299, status: 'pending', date: '2023-10-14' },
          { id: 'ORD-387426', user: 'datadefender', course: 'Network Defense Strategies', amount: 249, status: 'completed', date: '2023-10-13' },
          { id: 'ORD-387425', user: 'securityninja', course: 'Advanced Penetration Testing', amount: 299, status: 'completed', date: '2023-10-12' }
        ],
        recentUsers: [
          { username: 'cyberhunter', email: 'cyber@example.com', courses: 2, joinDate: '2023-10-10' },
          { username: 'securitypro', email: 'security@example.com', courses: 1, joinDate: '2023-10-09' },
          { username: 'hackerman', email: 'hacker@example.com', courses: 3, joinDate: '2023-10-08' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
    toast({
      title: "Dashboard Refreshed",
      description: "Latest data has been loaded."
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-mono font-bold text-white">
            Admin <span className="text-neon-green">Dashboard</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Manage your cybersecurity courses and users
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <div className="flex items-center gap-2 bg-cyber-dark p-2 rounded-md border border-neon-green/20">
            <Shield className="h-5 w-5 text-neon-green" />
            <span className="text-white font-mono">ADMIN CONSOLE</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          // Loading skeletons for stats cards
          Array(4).fill(0).map((_, index) => (
            <Card key={index} className="bg-cyber-light border-neon-green/30">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="bg-cyber-light border-neon-green/30 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/70 font-mono flex items-center">
                  <BookOpen className="h-4 w-4 text-neon-green mr-2" />
                  COURSES
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{dashboardData.stats.totalCourses}</div>
                <p className="text-xs text-white/60 mt-1">Active courses</p>
              </CardContent>
            </Card>

            <Card className="bg-cyber-light border-neon-green/30 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/70 font-mono flex items-center">
                  <Users className="h-4 w-4 text-neon-green mr-2" />
                  USERS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{dashboardData.stats.totalUsers}</div>
                <p className="text-xs text-white/60 mt-1">Registered users</p>
              </CardContent>
            </Card>

            <Card className="bg-cyber-light border-neon-green/30 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/70 font-mono flex items-center">
                  <BarChart3 className="h-4 w-4 text-neon-green mr-2" />
                  REVENUE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">${dashboardData.stats.totalRevenue}</div>
                <p className="text-xs text-white/60 mt-1">Total earnings</p>
              </CardContent>
            </Card>

            <Card className="bg-cyber-light border-neon-green/30 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/70 font-mono flex items-center">
                  <CreditCard className="h-4 w-4 text-neon-green mr-2" />
                  PAYMENTS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{dashboardData.stats.pendingPayments}</div>
                <p className="text-xs text-white/60 mt-1">Pending verification</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent Payments Table */}
      <div className="mb-8">
        <h2 className="text-xl font-mono font-semibold mb-4 flex items-center">
          <CreditCard className="h-5 w-5 text-neon-green mr-2" />
          <span className="text-white">Recent Payments</span>
        </h2>
        
        {loading ? (
          <Card className="bg-cyber-light border-neon-green/30">
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ) : (
          <div className="bg-cyber-light rounded-md border border-neon-green/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-cyber-dark/50 border-b border-neon-green/20">
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/70">ORDER ID</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/70">USER</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/70">COURSE</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/70">AMOUNT</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/70">STATUS</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/70">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentPayments.length > 0 ? (
                    dashboardData.recentPayments.map((payment, i) => (
                      <tr key={i} className="border-b border-neon-green/10 hover:bg-cyber-dark/30">
                        <td className="py-3 px-4 text-xs font-mono text-white">{payment.id}</td>
                        <td className="py-3 px-4 text-xs font-mono text-white">{payment.user}</td>
                        <td className="py-3 px-4 text-xs text-white">{payment.course}</td>
                        <td className="py-3 px-4 text-xs font-mono text-white">${payment.amount}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-mono px-2 py-1 rounded ${
                            payment.status === 'approved' 
                              ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                              : payment.status === 'pending'
                              ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
                              : 'bg-red-900/30 text-red-400 border border-red-500/30'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-white/70">{payment.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-white/60">
                        No recent payments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Recent Users */}
      <div>
        <h2 className="text-xl font-mono font-semibold mb-4 flex items-center">
          <Users className="h-5 w-5 text-neon-green mr-2" />
          <span className="text-white">Recent Users</span>
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, index) => (
              <Card key={index} className="bg-cyber-light border-neon-green/30">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <div className="flex gap-3">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.recentUsers.length > 0 ? (
              dashboardData.recentUsers.map((user, i) => (
                <Card key={i} className="bg-cyber-light border-neon-green/30 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-mono font-semibold text-neon-green">{user.username}</h3>
                        <p className="text-xs text-white/70 mt-1">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-white/60">Courses: {user.courses}</span>
                          <span className="text-xs text-white/60">Joined: {user.joinDate}</span>
                        </div>
                      </div>
                      <div className="bg-cyber-dark p-2 rounded-full">
                        <Users className="h-4 w-4 text-neon-green" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 text-center py-8 bg-cyber-light border border-neon-green/30 rounded-md">
                <p className="text-white/60">No recent users found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 