/**
 * Font Download Helper Script
 * 
 * This script helps you download the required font files for self-hosting.
 * Run this script with Node.js to download the font files to the public/fonts directory.
 * 
 * Usage:
 * 1. Make sure you have Node.js installed
 * 2. Run: node download-fonts.js
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create fonts directory if it doesn't exist
const fontsDir = path.join(__dirname, 'public', 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Font URLs - these are the latest versions as of script creation
// You may need to update these URLs if Google changes them
const fontFiles = [
  {
    name: 'inter-300.woff2',
    url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2'
  },
  {
    name: 'inter-400.woff2',
    url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2'
  },
  {
    name: 'inter-500.woff2',
    url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2'
  },
  {
    name: 'inter-600.woff2',
    url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2'
  },
  {
    name: 'inter-700.woff2',
    url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2'
  },
  {
    name: 'jetbrainsmono-400.woff2',
    url: 'https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8L6t3.woff2'
  },
  {
    name: 'jetbrainsmono-500.woff2',
    url: 'https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8L6t3.woff2'
  },
  {
    name: 'jetbrainsmono-600.woff2',
    url: 'https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8L6t3.woff2'
  },
  {
    name: 'jetbrainsmono-700.woff2',
    url: 'https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8L6t3.woff2'
  }
];

// Download function
function downloadFont(font) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(fontsDir, font.name);
    const file = fs.createWriteStream(filePath);
    
    https.get(font.url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${font.name}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there's an error
      console.error(`Error downloading ${font.name}: ${err.message}`);
      reject(err);
    });
  });
}

// Download all fonts
async function downloadAllFonts() {
  console.log('Starting font downloads...');
  
  for (const font of fontFiles) {
    try {
      await downloadFont(font);
    } catch (err) {
      console.error(`Failed to download ${font.name}`);
    }
  }
  
  console.log('All font downloads complete!');
}

// Start the download process
downloadAllFonts(); 