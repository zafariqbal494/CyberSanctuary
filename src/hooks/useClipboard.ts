import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export function useClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = (text: string, successMessage?: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      
      // Show success toast
      toast({
        title: "Copied to clipboard",
        description: successMessage || "Text copied to clipboard",
      });
      
      // Reset copied state after delay
      setTimeout(() => setCopied(false), resetDelay);
      
      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      
      // Show error toast
      toast({
        title: "Copy failed",
        description: "Failed to copy text to clipboard",
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  return {
    copied,
    copyToClipboard
  };
} 