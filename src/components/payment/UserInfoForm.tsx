import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User, Info } from 'lucide-react';
import { useForm } from "react-hook-form";
import { useUsernameValidator } from '@/hooks/useUsernameValidator';
import { useEmailValidator } from '@/hooks/useEmailValidator';

export interface UserFormData {
  username: string;
  email: string;
}

interface UserInfoFormProps {
  onSubmit: (data: UserFormData) => void;
  initialValues?: Partial<UserFormData>;
}

export const UserInfoForm = ({ onSubmit, initialValues = {} }: UserInfoFormProps) => {
  const { validateUsername, isChecking, error: usernameError, clearError: clearUsernameError } = useUsernameValidator();
  const { validateEmail, error: emailError, clearError: clearEmailError } = useEmailValidator();
  
  const { register, handleSubmit, getValues, setValue, formState } = useForm<UserFormData>({
    defaultValues: {
      username: initialValues.username || '',
      email: initialValues.email || ''
    }
  });
  
  // Set initial values when they change
  useEffect(() => {
    if (initialValues.username) {
      setValue('username', initialValues.username);
    }
    if (initialValues.email) {
      setValue('email', initialValues.email);
    }
  }, [initialValues, setValue]);
  
  const handleFormSubmit = async () => {
    const data = getValues();
    
    // Validate username
    const isUsernameValid = await validateUsername(data.username);
    if (!isUsernameValid) return;
    
    // Validate email
    const isEmailValid = validateEmail(data.email);
    if (!isEmailValid) return;
    
    // Submit if both are valid
    onSubmit(data);
  };
  
  return (
    <div className="space-y-2 sm:space-y-3">
      <div>
        <Label htmlFor="username" className="text-sm sm:text-sm mb-0.5 sm:mb-1 block text-white/80 font-mono">
          Username / Nickname
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-4 sm:w-4 text-neon-green" />
          <Input
            id="username"
            type="text"
            placeholder="Choose a username or nickname"
            className={`pl-10 sm:pl-10 text-sm sm:text-sm bg-cyber-light border-neon-green/30 text-white rounded-lg ${usernameError ? 'border-red-500 focus:border-red-500' : ''}`}
            aria-invalid={!!usernameError}
            aria-describedby={usernameError ? "username-error" : undefined}
            {...register('username', {
              onChange: () => clearUsernameError()
            })}
          />
          {isChecking && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="h-3 w-3 border-t-2 border-r-2 border-neon-green rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        {usernameError && (
          <p id="username-error" className="text-red-500 text-xs sm:text-xs mt-0.5">{usernameError}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className="text-sm sm:text-sm mb-0.5 sm:mb-1 block text-white/80 font-mono">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-4 sm:w-4 text-neon-green" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            className={`pl-10 sm:pl-10 text-sm sm:text-sm bg-cyber-light border-neon-green/30 text-white rounded-lg ${emailError ? 'border-red-500 focus:border-red-500' : ''}`}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
            {...register('email', {
              onChange: () => clearEmailError()
            })}
          />
        </div>
        {emailError && (
          <p id="email-error" className="text-red-500 text-xs sm:text-xs mt-0.5">{emailError}</p>
        )}
        <div className="flex items-start mt-1">
          <Info className="h-4 w-4 sm:h-3 sm:w-3 text-neon-green/80 mt-1 mr-1.5 flex-shrink-0" />
          <p className="text-xs sm:text-xs text-white/60 font-mono">
            User login credentials will be sent to this email after payment approval
          </p>
        </div>
      </div>
    
      <div className="pt-1 sm:pt-2">
        <Button 
          type="button" 
          onClick={handleFormSubmit}
          className="w-full bg-neon-green hover:bg-neon-green/90 text-cyber-dark font-mono text-sm sm:text-sm py-2 sm:py-2 rounded-lg"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}; 