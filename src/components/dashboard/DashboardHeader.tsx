import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { userService } from '@/services/userService';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await userService.logout();
      
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "There was a problem logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-mono font-bold text-white">
          {title.split(' ').map((word, index) => 
            index % 2 === 1 ? 
              <span key={index} className="text-neon-green">{word} </span> : 
              <span key={index}>{word} </span>
          )}
        </h1>
        {subtitle && (
          <p className="text-white/60 text-sm md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader; 