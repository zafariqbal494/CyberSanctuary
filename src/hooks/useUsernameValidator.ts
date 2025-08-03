import { useState } from 'react';
import { paymentService } from '@/services/api';

export function useUsernameValidator() {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const validateUsername = async (username: string): Promise<boolean> => {
    if (!username.trim()) {
      setError("Username is required");
      return false;
    }
    
    try {
      setIsChecking(true);
      setError(null);
      
      const exists = await paymentService.checkUsername(username);
      
      if (exists) {
        setError("This username is already taken");
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error checking username:', err);
      setError("Failed to validate username");
      return false;
    } finally {
      setIsChecking(false);
    }
  };
  
  return {
    validateUsername,
    isChecking,
    error,
    clearError: () => setError(null)
  };
} 