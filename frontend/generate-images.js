// Simple script to generate placeholder project images
// Run with: node generate-images.js

const fs = require('fs');
const path = require('path');

// Create a simple SVG image generator
function createProjectImage(projectId, projectName) {
  const initials = projectName.substring(0, 2).toUpperCase();
  const colors = [
    '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'
  ];
  const color = colors[projectId % colors.length];
  
  return `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad${projectId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color}80;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="300" height="200" fill="url(#grad${projectId})"/>
    <text x="150" y="100" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
          text-anchor="middle" fill="white" dominant-baseline="middle">${initials}</text>
    <text x="150" y="130" font-family="Arial, sans-serif" font-size="16" 
          text-anchor="middle" fill="white" opacity="0.8">${projectName}</text>
  </svg>`;
}

// Generate images for projects 1-10
const projects = [
  'RD Services',
  'Marketing Automation', 
  'E-commerce Platform',
  'Data Analytics Dashboard',
  'Mobile App Development',
  'Website Optimization',
  'Security Audit System',
  'Test Project',
  'Financial Reporting Dashboard',
  'Employee Onboarding System'
];

projects.forEach((name, index) => {
  const projectId = index + 1;
  const svg = createProjectImage(projectId, name);
  const filePath = path.join(__dirname, 'public', 'images', `project-${projectId}.jpg`);
  
  // Note: This creates SVG files, but you can convert them to JPG using online tools
  // or replace with actual JPG images
  fs.writeFileSync(filePath.replace('.jpg', '.svg'), svg);
  console.log(`Generated project-${projectId}.svg`);
});

console.log('\n✅ Generated placeholder images!');
console.log('📝 Note: These are SVG files. For production, convert to JPG or add real images.');
console.log('📁 Images are in: frontend/public/images/');
