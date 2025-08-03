import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface ErrorViewProps {
  error: string | null;
  onBack: () => void;
}

export const ErrorView = ({ error, onBack }: ErrorViewProps) => {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-mono mb-6">{error || 'Course not found'}</h1>
      <Button variant="outline" className="btn-cyber" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Courses
      </Button>
    </div>
  );
}; 