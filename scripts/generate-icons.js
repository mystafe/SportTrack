// Simple script to generate placeholder PWA icons
// For production, replace with actual designed icons

const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const svgIcon = `
<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" rx="20" fill="#0ea5e9"/>
  <text x="96" y="120" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle">ST</text>
</svg>
`;

const publicDir = path.join(__dirname, '..', 'public');

// Write SVG (can be converted to PNG later)
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);

console.log('Icon placeholder created. For production, replace with actual PNG icons.');
console.log('Recommended sizes: 192x192px and 512x512px');

