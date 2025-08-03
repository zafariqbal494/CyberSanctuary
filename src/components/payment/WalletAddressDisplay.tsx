import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Check, Copy } from 'lucide-react';
import { useWalletAddress } from '@/hooks/useWalletAddress';
import { useClipboard } from '@/hooks/useClipboard';

interface WalletAddressDisplayProps {
  price: number;
}

export const WalletAddressDisplay = ({ price }: WalletAddressDisplayProps) => {
  const { walletAddress, networkName, isLoading, error } = useWalletAddress();
  const { copied, copyToClipboard } = useClipboard();
  
  const handleCopy = () => {
    if (error) return;
    copyToClipboard(walletAddress, "Wallet address copied to clipboard");
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base sm:text-lg font-mono font-semibold text-white">Bitcoin Payment</h2>
        <p className="text-xs sm:text-sm text-white/70 mt-1">
          Transfer ${price} USDT of Bitcoin to mentioned Wallet Address
        </p>
      </div>
      
      <div>
        <Label htmlFor="wallet-address" className="text-xs sm:text-sm mb-1 sm:mb-2 block text-white/80 font-mono">
          <span className="text-neon-green font-bold">Network:</span> {networkName}
        </Label>
        <div className="relative">
          <Input
            id="wallet-address"
            value={walletAddress}
            readOnly
            disabled={isLoading}
            className={`pr-10 sm:pr-12 font-mono text-xs sm:text-sm bg-cyber-light border-neon-green/30 text-white rounded-lg ${error ? 'border-red-500 text-red-400' : ''}`}
            aria-label="Bitcoin wallet address"
          />
          {isLoading ? (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="h-3 w-3 border-t-2 border-r-2 border-neon-green rounded-full animate-spin"></div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleCopy}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${error ? 'text-red-400 hover:text-red-300' : 'text-neon-green hover:text-white'}`}
              aria-label="Copy Bitcoin address"
              disabled={error}
            >
              {copied ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <Copy className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          )}
        </div>
        
        <div className="mt-3 sm:mt-4 bg-cyber-light bg-opacity-50 p-2 sm:p-3 rounded-lg border border-neon-green/20">
          <div className="flex items-start">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-white/80 font-mono">
              Ensure you send the correct amount using a compatible network ({networkName}). 
              Save a screenshot of your transaction for verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 