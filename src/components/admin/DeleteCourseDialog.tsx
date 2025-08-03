import { AlertTriangle } from 'lucide-react';
import { Course } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  course: Course | null;
}

const DeleteCourseDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  course 
}: DeleteCourseDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-cyber-dark border border-red-500/30 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Course
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white/70">
            Are you sure you want to delete "{course?.name}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border border-white/20 text-white hover:bg-white/5">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCourseDialog; 