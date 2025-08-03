/**
 * Utility functions for handling images
 */

// Use environment variable or fallback for backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

/**
 * Get the full URL for an image, handling both relative and absolute URLs
 * @param url - The image URL
 * @param fallback - Optional fallback URL if the provided URL is empty
 * @returns The full image URL
 */
export const getImageUrl = (url: string | undefined | null, fallback: string = '/placeholder.svg'): string => {
  if (!url) return fallback;
  
  // If the URL already starts with http:// or https://, use it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, prepend the backend URL
  return `${BACKEND_URL}${url}`;
};

/**
 * Calculate image dimensions based on aspect ratio
 * @param width - The width of the image
 * @param height - The height of the image
 * @param targetWidth - The target width
 * @returns The calculated dimensions
 */
export const calculateImageDimensions = (
  width: number,
  height: number,
  targetWidth: number
): { width: number; height: number } => {
  const aspectRatio = width / height;
  const calculatedHeight = Math.round(targetWidth / aspectRatio);
  
  return {
    width: targetWidth,
    height: calculatedHeight,
  };
};

/**
 * Generate a list of srcset URLs for responsive images
 * @param url - The base image URL
 * @param widths - Array of widths to generate
 * @returns The srcset string
 */
export const generateSrcSet = (url: string, widths: number[] = [320, 640, 768, 1024, 1280]): string => {
  if (!url) return '';
  
  // Don't modify data URLs or SVGs
  if (url.startsWith('data:') || url.endsWith('.svg')) {
    return url;
  }
  
  const baseUrl = url.split('?')[0]; // Remove any existing query parameters
  const queryParams = url.includes('?') ? url.split('?')[1] : '';
  
  // Generate srcset with different widths
  return widths
    .map(width => {
      // Add width parameter to URL
      const widthParam = `w=${width}`;
      
      // Combine with existing query parameters if any
      const fullParams = queryParams ? `${queryParams}&${widthParam}` : widthParam;
      
      return `${baseUrl}?${fullParams} ${width}w`;
    })
    .join(', ');
};

/**
 * Generate appropriate sizes attribute for responsive images
 * @param breakpoints - Object containing breakpoint configurations
 * @returns The sizes string
 */
export const generateSizes = (
  breakpoints: { [key: string]: string } = {
    '(max-width: 640px)': '100vw',
    '(max-width: 768px)': '75vw',
    '(max-width: 1024px)': '50vw',
    default: '33vw',
  }
): string => {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => {
      if (breakpoint === 'default') {
        return size;
      }
      return `${breakpoint} ${size}`;
    })
    .join(', ');
};

/**
 * Convert an image URL to WebP format if the browser supports it
 * @param url - The original image URL
 * @param supportsWebp - Whether the browser supports WebP
 * @param quality - The image quality (1-100)
 * @returns The WebP URL if supported, otherwise the original URL
 */
export const convertToWebP = (url: string, supportsWebp: boolean, quality: number = 80): string => {
  if (!supportsWebp || !url || url.startsWith('data:') || url.endsWith('.svg') || url.endsWith('.webp')) {
    return url;
  }
  
  const baseUrl = url.split('?')[0];
  const hasParams = url.includes('?');
  const params = hasParams ? url.split('?')[1] : '';
  
  // Add WebP format parameter
  const webpParam = `format=webp&q=${quality}`;
  
  if (params) {
    return `${baseUrl}?${params}&${webpParam}`;
  } else {
    return `${baseUrl}?${webpParam}`;
  }
}; 