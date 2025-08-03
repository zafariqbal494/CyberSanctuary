/**
 * Utility for progressive font loading
 * This helps optimize font loading by loading critical fonts first,
 * then loading non-critical weights later
 */

// Declare the Font Loading API types
declare global {
  interface Document {
    fonts?: {
      load(font: string): Promise<FontFace[]>;
    };
  }
}

/**
 * Load non-critical font weights after the page has loaded
 * With self-hosted fonts, we don't need to load additional CSS
 * as all font weights are defined in selfHostedFonts.css
 */
export function loadNonCriticalFonts(): void {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;
  
  // With self-hosted fonts, we don't need to load additional CSS
  // All font weights are already defined in selfHostedFonts.css
  console.debug('Using self-hosted fonts, all weights included in main CSS');
}

/**
 * Check if fonts are loaded and add a class to the document
 */
export function detectFontLoading(): void {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;
  
  // Check if the Font Loading API is available
  if (document.fonts) {
    // Wait for critical fonts to load
    Promise.all([
      document.fonts.load('400 1em JetBrains Mono'),
      document.fonts.load('400 1em Inter')
    ]).then(() => {
      // Add a class to indicate fonts are loaded
      document.documentElement.classList.add('fonts-loaded');
      console.debug('Critical fonts loaded');
    });
  } else {
    // Fallback for browsers without Font Loading API
    document.documentElement.classList.add('fonts-loaded');
  }
}

/**
 * Initialize font loading
 * Call this function in your main entry point
 */
export function initFontLoading(): void {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;
  
  // If the page is already loaded, detect fonts immediately
  if (document.readyState === 'complete') {
    detectFontLoading();
  } else {
    // Otherwise, wait for the page to load
    window.addEventListener('load', detectFontLoading);
  }
}

export default {
  initFontLoading,
  loadNonCriticalFonts,
  detectFontLoading
}; 