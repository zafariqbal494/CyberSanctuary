import { Button } from "@/components/ui/button";
import { useFileSelector } from '@/hooks/useFileSelector';

interface PaymentProofUploaderProps {
  onFileSelected: (file: File | null) => void;
}

export const PaymentProofUploader = ({ onFileSelected }: PaymentProofUploaderProps) => {
  const {
    fileSelected,
    fileName,
    selectedFile,
    fileInputRef,
    handleFileChange,
    triggerFileInput
  } = useFileSelector();
  
  // Update parent component when file changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e);
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    } else {
      onFileSelected(null);
    }
  };
  
  return (
    <div>
      <h2 className="text-base sm:text-lg font-mono font-semibold text-white">Proof of Payment</h2>
      
      <div className="mt-2 sm:mt-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
          <Button
            type="button"
            onClick={triggerFileInput}
            className="bg-cyber-light border border-neon-green/30 text-neon-green hover:bg-cyber-light/80 font-mono text-xs sm:text-sm py-1.5 px-3 w-fit rounded-lg"
          >
            Select Screenshot
          </Button>
          <div className="bg-cyber-light/50 px-2 py-1 rounded-lg border border-neon-green/20 w-full sm:w-[200px] overflow-hidden">
            <p className="text-xs text-white/70 font-mono truncate">
              {fileSelected ? fileName : 'No file chosen'}
            </p>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          className="hidden"
          accept="image/*"
          aria-label="Upload payment screenshot"
        />
      </div>
    </div>
  );
}; 