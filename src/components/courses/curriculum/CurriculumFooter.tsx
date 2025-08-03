import { CurriculumFooterProps } from './types';

/**
 * Footer component for the course curriculum
 * Displays course features and contact information
 */
export const CurriculumFooter = ({ telegramLink }: CurriculumFooterProps) => {
  return (
    <div className="p-4 md:p-6 bg-gradient-to-b from-transparent to-cyber-darker/50">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        <div className="bg-cyber-dark/40 py-1 px-2 md:py-1.5 md:px-3 rounded-lg flex items-center justify-center border border-neon-green/30">
          <span className="text-white/70 text-[10px] md:text-xs">HD Video Lectures</span>
        </div>
        <div className="bg-cyber-dark/40 py-1 px-2 md:py-1.5 md:px-3 rounded-lg flex items-center justify-center border border-neon-green/30">
          <span className="text-white/70 text-[10px] md:text-xs">Practical Exercises</span>
        </div>
        <div className="bg-cyber-dark/40 py-1 px-2 md:py-1.5 md:px-3 rounded-lg flex items-center justify-center border border-neon-green/30">
          <span className="text-white/70 text-[10px] md:text-xs">Downloadable Resources</span>
        </div>
        <div className="bg-cyber-dark/40 py-1 px-2 md:py-1.5 md:px-3 rounded-lg flex items-center justify-center border border-neon-green/30">
          <span className="text-white/70 text-[10px] md:text-xs">Community Support</span>
        </div>
      </div>
      
      <div className="mt-4 text-center text-white/60 text-[10px] md:text-xs">
        For any questions, contact us on {' '}
        <a 
          href={telegramLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-neon-green hover:underline"
          aria-label="Contact us on Telegram"
        >
          Telegram
        </a>
      </div>
    </div>
  );
}; 