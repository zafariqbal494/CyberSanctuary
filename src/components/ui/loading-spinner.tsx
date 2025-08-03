import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({
  size = 'md',
  className,
  text,
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const spinner = (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-t-transparent border-neon-green",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="mt-3 text-sm text-neon-green/80 font-mono">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-cyber-dark/90 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const PageLoader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-cyber-dark">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}; 