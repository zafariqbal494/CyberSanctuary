
import { Shield, Link } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cyber-darker border-t border-neon-green/20 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Shield className="h-5 w-5 text-neon-green" />
            <span className="font-mono font-bold text-white">
              CYBER<span className="text-neon-green">SANCTUARY</span>
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-sm text-white/60">
            <a href="#" className="hover:text-neon-green transition-colors flex items-center gap-1">
              <Link className="h-3 w-3" />
              Terms of Service
            </a>
            <a href="#" className="hover:text-neon-green transition-colors flex items-center gap-1">
              <Link className="h-3 w-3" />
              Privacy Policy
            </a>
            <a href="#" className="hover:text-neon-green transition-colors flex items-center gap-1">
              <Link className="h-3 w-3" />
              Security
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} CyberSanctuary Arsenal. All rights reserved.</p>
          <p className="mt-1">For ethical hackers and cybersecurity professionals only.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
