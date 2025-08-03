import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Settings = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [networkName, setNetworkName] = useState('');
  const [telegramLink, setTelegramLink] = useState('');
  const [originalWalletAddress, setOriginalWalletAddress] = useState('');
  const [originalNetworkName, setOriginalNetworkName] = useState('');
  const [originalTelegramLink, setOriginalTelegramLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://127.0.0.1:8000/api/admin/settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        
        const data = await response.json();
        setWalletAddress(data.walletAddress || '');
        setOriginalWalletAddress(data.walletAddress || '');
        setNetworkName(data.networkName || 'Tron (TRC20)');
        setOriginalNetworkName(data.networkName || 'Tron (TRC20)');
        setTelegramLink(data.telegramLink || 'https://t.me/CyberTraining');
        setOriginalTelegramLink(data.telegramLink || 'https://t.me/CyberTraining');
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load settings. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  useEffect(() => {
    setHasChanges(
      walletAddress !== originalWalletAddress || 
      networkName !== originalNetworkName ||
      telegramLink !== originalTelegramLink
    );
  }, [walletAddress, originalWalletAddress, networkName, originalNetworkName, telegramLink, originalTelegramLink]);

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://127.0.0.1:8000/api/admin/settings/payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, networkName, telegramLink }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update payment settings');
      }
      
      setOriginalWalletAddress(walletAddress);
      setOriginalNetworkName(networkName);
      setOriginalTelegramLink(telegramLink);
      setHasChanges(false);
      
      toast({
        title: 'Success',
        description: 'Settings updated successfully',
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neon-green/10 rounded-lg">
            <SettingsIcon className="h-6 w-6 text-neon-green" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-white/60">Manage system settings and configurations</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-cyber-light border-neon-green/20">
          <CardHeader>
            <CardTitle className="text-white font-mono">Payment Settings</CardTitle>
            <CardDescription className="text-white/60">
              Configure payment-related settings for the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="network-name" className="block text-sm font-medium text-white/80 mb-1">
                  Network Name
                </label>
                <div className="relative">
                  <Input
                    id="network-name"
                    placeholder="Enter cryptocurrency network name"
                    value={networkName}
                    onChange={(e) => setNetworkName(e.target.value)}
                    className="bg-cyber-darker border-neon-green/30 text-white font-mono"
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="h-4 w-4 border-t-2 border-r-2 border-neon-green rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-white/60">
                  This network name will be displayed to users during the payment process.
                </p>
              </div>

              <div>
                <label htmlFor="wallet-address" className="block text-sm font-medium text-white/80 mb-1">
                  Wallet Address
                </label>
                <div className="relative">
                  <Input
                    id="wallet-address"
                    placeholder="Enter wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="bg-cyber-darker border-neon-green/30 text-white font-mono"
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="h-4 w-4 border-t-2 border-r-2 border-neon-green rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-white/60">
                  This wallet address will be displayed to users during the payment process.
                </p>
              </div>

              <div>
                <label htmlFor="telegram-link" className="block text-sm font-medium text-white/80 mb-1">
                  Telegram Link
                </label>
                <div className="relative">
                  <Input
                    id="telegram-link"
                    placeholder="Enter Telegram link (e.g., https://t.me/YourChannel)"
                    value={telegramLink}
                    onChange={(e) => setTelegramLink(e.target.value)}
                    className="bg-cyber-darker border-neon-green/30 text-white font-mono"
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="h-4 w-4 border-t-2 border-r-2 border-neon-green rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-white/60">
                  This Telegram link will be displayed to users in the course curriculum section.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-neon-green/10 pt-4">
            <div className="flex items-center">
              {hasChanges && (
                <div className="flex items-center text-amber-400 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span>Unsaved changes</span>
                </div>
              )}
            </div>
            <Button
              onClick={handleSaveSettings}
              disabled={isLoading || isSaving || !hasChanges}
              className="bg-neon-green hover:bg-neon-green/90 text-cyber-dark"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 border-t-2 border-r-2 border-cyber-dark rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings; 