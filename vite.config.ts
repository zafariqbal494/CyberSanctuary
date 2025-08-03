import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/react-router-dom/')) {
            return 'vendor-react';
          }

          // UI components split by usage pattern
          if (id.includes('@radix-ui/react-slot') || 
              id.includes('@radix-ui/react-label')) {
            return 'ui-core';
          }
          
          if (id.includes('@radix-ui/react-dialog') || 
              id.includes('@radix-ui/react-alert-dialog') || 
              id.includes('@radix-ui/react-popover')) {
            return 'ui-dialogs';
          }
          
          if (id.includes('@radix-ui/react-dropdown-menu') || 
              id.includes('@radix-ui/react-navigation-menu')) {
            return 'ui-navigation';
          }
          
          if (id.includes('@radix-ui/react-checkbox') || 
              id.includes('@radix-ui/react-select') || 
              id.includes('@radix-ui/react-radio-group')) {
            return 'ui-forms';
          }
          
          if (id.includes('@radix-ui/react-toast') || 
              id.includes('@radix-ui/react-progress')) {
            return 'ui-feedback';
          }
          
          if (id.includes('@radix-ui/react-accordion') || 
              id.includes('@radix-ui/react-separator')) {
            return 'ui-layout';
          }
          
          // Lucide icons split by feature
          if (id.includes('lucide-react')) {
            if (id.includes('/icons/users') || 
                id.includes('/icons/settings') ||
                id.includes('/icons/edit') ||
                id.includes('/icons/trash')) {
              return 'icons-admin';
            }
            
            if (id.includes('/icons/book') || 
                id.includes('/icons/video') ||
                id.includes('/icons/play')) {
              return 'icons-courses';
            }
            
            return 'icons-common';
          }
          
          // UI utilities
          if (id.includes('class-variance-authority') || 
              id.includes('tailwind-merge')) {
            return 'utils-styling';
          }
          
          // Form libraries
          if (id.includes('react-hook-form') || 
              id.includes('@hookform/resolvers')) {
            return 'utils-forms';
          }
          
          if (id.includes('zod')) {
            return 'utils-validation';
          }
          
          // Data fetching
          if (id.includes('@tanstack/react-query')) {
            if (id.includes('/devtools') || id.includes('/mutation')) {
              return 'data-advanced';
            }
            return 'data-core';
          }
          
          // Feature-based chunks for application code
          if (id.includes('/src/components/courses/') || 
              id.includes('/src/hooks/useCourse') || 
              id.includes('/src/services/courseService')) {
            return 'feature-courses';
          }
          
          if (id.includes('/src/components/admin/') || 
              id.includes('/src/hooks/useCourseEditor')) {
            return 'feature-admin';
          }
          
          if (id.includes('/src/components/payment/') || 
              id.includes('/src/hooks/usePaymentSubmission')) {
            return 'feature-payment';
          }
          
          if (id.includes('/src/components/dashboard/') || 
              id.includes('/src/hooks/useUser')) {
            return 'feature-dashboard';
          }
          
          if (id.includes('/src/components/home/')) {
            return 'feature-home';
          }
        },
        // Ensure chunk filenames include content hash for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Enable minification
    minify: true,
    // Enable source maps for production builds
    sourcemap: mode !== 'production',
  },
}));
