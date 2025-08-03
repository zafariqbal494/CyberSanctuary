
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Menu, X, GraduationCap, User, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [telegramLink, setTelegramLink] = useState('');
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchTelegramLink = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/settings/telegram-link');
        if (response.ok) {
          const data = await response.json();
          setTelegramLink(data.telegramLink);
        }
      } catch (error) {
        console.error('Failed to fetch Telegram link:', error);
      }
    };

    fetchTelegramLink();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-dark/90 backdrop-blur-md border-b border-neon-green/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <Shield className="h-6 w-6 text-neon-green group-hover:animate-glow" />
            <span className="font-mono font-bold text-lg text-white">
              CYBER<span className="text-neon-green">SANCTUARY</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="font-mono text-white/80 hover:text-neon-green transition-colors">HOME</Link>
            <Link to="/courses" className="font-mono text-white/80 hover:text-neon-green transition-colors">COURSES</Link>
            <a href={telegramLink || '#'} target="_blank" rel="noopener noreferrer" className="font-mono text-white/80 hover:text-neon-green transition-colors">CONTACT</a>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/dashboard" 
                  className="btn-cyber flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  DASHBOARD
                </Link>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="btn-cyber flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                LOGIN
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white/80 hover:text-neon-green"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neon-green/20 mt-3 flex flex-col gap-4">
            <Link 
              to="/" 
              className="font-mono text-white/80 hover:text-neon-green py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              HOME
            </Link>
            <Link 
              to="/courses" 
              className="font-mono text-white/80 hover:text-neon-green py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              COURSES
            </Link>
            <a 
              href={telegramLink || '#'} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-mono text-white/80 hover:text-neon-green py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              CONTACT
            </a>
            
            {isLoggedIn ? (
              <Link 
                to="/dashboard" 
                className="btn-cyber w-full text-center mt-2 flex items-center justify-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                DASHBOARD
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="btn-cyber w-full text-center mt-2 flex items-center justify-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                LOGIN
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
