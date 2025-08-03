import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { generateSrcSet, generateSizes } from '@/utils/imageUtils';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  quality?: number;
}

export function ResponsiveImage({
  src,
  alt,
  className,
  width,
  height,
  sizes = '100vw',
  aspectRatio = '16/9',
  objectFit = 'cover',
  priority = false,
  fallbackSrc = '/placeholder.svg',
  onLoad,
  onError,
  quality = 80,
  ...props
}: ResponsiveImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(!priority);
  const [supportsWebp, setSupportsWebp] = useState<boolean | null>(null);
  const [srcSet, setSrcSet] = useState<string>('');

  // Check if browser supports WebP
  useEffect(() => {
    const checkWebpSupport = async () => {
      const webpSupported = await testWebP();
      setSupportsWebp(webpSupported);
    };
    
    checkWebpSupport();
  }, []);

  // Update srcSet when src or WebP support changes
  useEffect(() => {
    if (src) {
      const optimizedSrc = getOptimizedSrc(src);
      setImgSrc(optimizedSrc);
      
      // Generate srcSet for responsive images
      const widths = [320, 640, 768, 1024, 1280];
      setSrcSet(generateSrcSet(optimizedSrc, widths));
    }
  }, [src, supportsWebp]);

  // Function to test WebP support
  const testWebP = () => {
    return new Promise<boolean>((resolve) => {
      const webP = new Image();
      webP.onload = () => resolve(true);
      webP.onerror = () => resolve(false);
      webP.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    });
  };

  // Convert image URL to WebP if supported
  const getOptimizedSrc = (url: string): string => {
    if (!url) return fallbackSrc;

    // Don't modify data URLs or SVGs
    if (url.startsWith('data:') || url.endsWith('.svg')) {
      return url;
    }

    // Handle backend URLs
    if (url.startsWith('/') && !url.startsWith('//')) {
      // Use environment variable or config for backend URL
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
      
      // For relative URLs from backend, prepend backend URL
      if (!url.startsWith('/storage')) {
        url = `${backendUrl}${url}`;
      } else {
        url = `${backendUrl}${url}`;
      }
    }

    // If WebP is supported and we're not already using a WebP image
    if (supportsWebp === true && !url.endsWith('.webp')) {
      // Check if URL contains query parameters
      const hasParams = url.includes('?');
      
      // Add WebP format parameter
      if (hasParams) {
        return `${url}&format=webp&q=${quality}`;
      } else {
        return `${url}?format=webp&q=${quality}`;
      }
    }

    // Add quality parameter for non-WebP images
    if (!url.includes('?')) {
      return `${url}?q=${quality}`;
    }
    
    return url;
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setImgSrc(fallbackSrc);
    onError?.();
  };

  // Calculate default dimensions based on aspect ratio if not provided
  const getImageDimensions = () => {
    if (width && height) {
      return { width, height };
    }
    
    if (width && aspectRatio) {
      // Parse aspect ratio (format: "16/9")
      const [w, h] = aspectRatio.split('/').map(Number);
      if (!isNaN(w) && !isNaN(h) && h !== 0) {
        const calculatedHeight = Math.round(width * (h / w));
        return { width, height: calculatedHeight };
      }
    }
    
    if (height && aspectRatio) {
      // Parse aspect ratio (format: "16/9")
      const [w, h] = aspectRatio.split('/').map(Number);
      if (!isNaN(w) && !isNaN(h) && w !== 0) {
        const calculatedWidth = Math.round(height * (w / h));
        return { width: calculatedWidth, height };
      }
    }
    
    // Default dimensions if nothing is provided
    return { width: 800, height: 450 }; // Default 16:9 aspect ratio
  };

  const dimensions = getImageDimensions();
  
  // Determine aspect ratio style
  const aspectRatioStyle = aspectRatio
    ? { aspectRatio, objectFit }
    : {};

  return (
    <div 
      className={cn(
        "relative overflow-hidden", 
        isLoading && "bg-cyber-dark animate-pulse",
        className
      )}
      style={{
        ...aspectRatioStyle,
        // Prevent layout shift by setting a minimum height
        minHeight: dimensions.height ? `${dimensions.height}px` : undefined,
      }}
    >
      {/* Placeholder while loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-cyber-dark">
          <div className="w-8 h-8 border-2 border-neon-green/30 border-t-neon-green rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={imgSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          objectFit === 'cover' && "object-cover",
          objectFit === 'contain' && "object-contain",
          objectFit === 'fill' && "object-fill",
          objectFit === 'none' && "object-none",
          objectFit === 'scale-down' && "object-scale-down"
        )}
        {...props}
      />
    </div>
  );
} 