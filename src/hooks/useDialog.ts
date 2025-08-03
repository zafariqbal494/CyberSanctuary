import { useState } from 'react';

export interface UseDialogReturn<T> {
  isOpen: boolean;
  data: T | null;
  open: (data?: T) => void;
  close: () => void;
}

// Generic dialog hook that can store dialog-specific data
export function useDialog<T = any>(initialState: boolean = false): UseDialogReturn<T> {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);
  const [data, setData] = useState<T | null>(null);
  
  const open = (data?: T) => {
    if (data) {
      setData(data);
    }
    setIsOpen(true);
  };
  
  const close = () => {
    setIsOpen(false);
    // Optionally clear data when dialog closes
    // Comment this out if you want to keep data after closing
    // setData(null);
  };
  
  return { isOpen, data, open, close };
} 