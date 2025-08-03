import { useState } from 'react';

export function useEmailValidator() {
  const [error, setError] = useState<string | null>(null);
  
  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    setError(null);
    return true;
  };
  
  return {
    validateEmail,
    error,
    clearError: () => setError(null)
  };
} 