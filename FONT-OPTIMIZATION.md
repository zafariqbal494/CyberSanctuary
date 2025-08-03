# Font Optimization Guide

This guide explains how to optimize font loading in the CyberSanctuary Arsenal website to improve performance and user experience.

## Current Implementation

The current implementation uses Google Fonts with the following optimizations:

1. **Preconnect to Google Fonts domains**
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   ```

2. **Preload critical font files**
   ```html
   <link rel="preload" href="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8L6t3.woff2" as="font" type="font/woff2" crossorigin />
   <link rel="preload" href="https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2" as="font" type="font/woff2" crossorigin />
   ```

3. **Font Display Swap**
   The `&display=swap` parameter is added to the Google Fonts URL to ensure text remains visible during font loading.

4. **Text Parameter for Subsetting**
   The `&text=...` parameter is added to the Google Fonts URL to only load the characters we need.

5. **Progressive Font Loading**
   Critical font weights are loaded first, and non-critical weights are loaded after the page is interactive.

6. **Font Loading API**
   The Font Loading API is used to detect when fonts are loaded and add a class to the document.

## Self-Hosting Fonts (Advanced Optimization)

For even better performance, you can self-host the fonts. Here's how:

### Step 1: Download the Font Files

1. Go to [Google Webfonts Helper](https://google-webfonts-helper.herokuapp.com/)
2. Search for "JetBrains Mono" and select the weights you need (400, 500, 600, 700)
3. Choose "Modern Browsers" to get WOFF2 format only
4. Download the font files
5. Repeat for "Inter" with weights 300, 400, 500, 600, 700

### Step 2: Create a Fonts Directory

Create a directory in the `public` folder for your font files:

```
mkdir -p public/fonts
```

### Step 3: Copy the Font Files

Copy the downloaded WOFF2 files to the `public/fonts` directory and rename them to match the paths in `src/utils/selfHostedFonts.css`.

### Step 4: Use Self-Hosted Fonts

To use the self-hosted fonts instead of Google Fonts:

1. Remove the Google Fonts links from `index.html`:
   ```html
   <!-- Remove these lines -->
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap&text=..." rel="stylesheet" />
   ```

2. Import the self-hosted fonts CSS in `src/index.css`:
   ```css
   /* Add this import at the top */
   @import './utils/selfHostedFonts.css';
   ```

3. Update the font loading utility to work with self-hosted fonts:
   ```js
   // In src/utils/fontLoader.ts
   export function loadNonCriticalFonts(): void {
     // No need to load additional fonts when self-hosting
     console.debug('Using self-hosted fonts, no additional loading needed');
   }
   ```

## Performance Benefits

Self-hosting fonts provides several performance benefits:

1. **Reduced Network Requests**: No need to connect to external domains
2. **Better Caching Control**: You can set your own cache headers
3. **No Third-Party Dependencies**: Eliminates reliance on Google Fonts availability
4. **Reduced TTFB (Time To First Byte)**: Fonts are served from your own server
5. **Privacy Compliance**: No data is sent to Google, helping with GDPR compliance

## Monitoring Font Performance

Use these tools to monitor font performance:

1. **Lighthouse**: Check the "Performance" tab for font-related metrics
2. **WebPageTest**: Look for font-related waterfall entries
3. **Chrome DevTools**: Use the "Network" tab to see font loading times
4. **Core Web Vitals**: Monitor LCP and CLS metrics, which can be affected by font loading

## Additional Optimizations

1. **Font Subsetting**: Use tools like `pyftsubset` to remove unused characters
2. **Variable Fonts**: Consider using variable fonts for even smaller file sizes
3. **Font Loading API**: Use the Font Loading API for more control over font loading
4. **Critical CSS**: Inline critical CSS to avoid render-blocking resources 