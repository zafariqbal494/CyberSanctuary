import { useState, useEffect } from 'react';
import { paymentService, WalletAddressResponse } from '@/services/api';

export function useWalletAddress() {
  const [walletAddress, setWalletAddress] = useState('');
  const [networkName, setNetworkName] = useState('Tron (TRC20)');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchWalletAddress = async () => {
      try {
        setIsLoading(true);
        const data = await paymentService.getWalletAddress();
        setWalletAddress(data.walletAddress || '');
        setNetworkName(data.networkName || 'Tron (TRC20)');
        setError(null);
      } catch (err) {
        console.error('Error fetching wallet address:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setWalletAddress('Error loading wallet address');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWalletAddress();
  }, []);
  
  return { 
    walletAddress, 
    networkName, 
    isLoading, 
    error: error !== null,
    errorMessage: error?.message 
  };
} 