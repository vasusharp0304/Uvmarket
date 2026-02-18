import fs from 'fs';
import path from 'path';

// Create icons directory
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Simple SVG icon as a base
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <rect width="192" height="192" fill="#7c3aed"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
        font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white">
    UV
  </text>
</svg>`;

// Save the SVG
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon);

console.log('Icons directory created at:', iconsDir);
console.log('SVG icon created');
console.log('Note: For production, use a proper icon generator like pwa-asset-generator');
