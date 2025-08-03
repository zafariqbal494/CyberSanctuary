import { useState, useRef } from 'react';

export function useFileSelector() {
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileSelected(true);
      setFileName(file.name);
      setSelectedFile(file);
    } else {
      setFileSelected(false);
      setFileName('');
      setSelectedFile(null);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const clearFile = () => {
    setFileSelected(false);
    setFileName('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return {
    fileSelected,
    fileName,
    selectedFile,
    fileInputRef,
    handleFileChange,
    triggerFileInput,
    clearFile
  };
} 