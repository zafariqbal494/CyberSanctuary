// API base URL - should be moved to environment variables in a production app
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Common fetch options
const fetchOptions = {
  mode: 'cors' as RequestMode,
  credentials: 'include' as RequestCredentials,
  headers: {
    'Accept': 'application/json'
  }
};

export interface PaymentResponse {
  order_id: string;
  status: string;
  message?: string;
}

export interface WalletAddressResponse {
  walletAddress: string;
  networkName: string;
}

export const paymentService = {
  async getWalletAddress(): Promise<WalletAddressResponse> {
    const response = await fetch(`${API_BASE_URL}/settings/wallet-address`, {
      ...fetchOptions
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch wallet address');
    }
    
    return response.json();
  },
  
  async checkUsername(username: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/check-username?username=${encodeURIComponent(username)}`, {
      ...fetchOptions
    });
    
    if (!response.ok) {
      throw new Error('Failed to check username');
    }
    
    const data = await response.json();
    return data.exists;
  },
  
  async submitPayment(formData: FormData): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        credentials: 'include',
        // Don't set Content-Type header, browser will set it with boundary for FormData
      });
      
      if (!response.ok) {
        if (response.status === 0) {
          throw new Error('Network error - CORS issue or server unavailable');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit payment');
      }
      
      return response.json();
    } catch (error) {
      console.error('Payment submission error:', error);
      throw error;
    }
  },
  
  async getTelegramLink(): Promise<{ telegramLink: string }> {
    const response = await fetch(`${API_BASE_URL}/settings/telegram-link`, {
      ...fetchOptions
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Telegram link');
    }
    
    return response.json();
  }
}; 