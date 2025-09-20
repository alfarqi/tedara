const fs = require('fs');
const path = require('path');

console.log('🔧 Combining builds for path-based routing...');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy storefront build to root dist
const storefrontDist = path.join(__dirname, '..', 'storefront', 'dist');
const storefrontFiles = fs.readdirSync(storefrontDist);

console.log('📁 Copying storefront files to root dist...');
storefrontFiles.forEach(file => {
  const srcPath = path.join(storefrontDist, file);
  const destPath = path.join(distDir, file);
  
  if (fs.statSync(srcPath).isDirectory()) {
    // Copy directory recursively
    copyDir(srcPath, destPath);
  } else {
    // Copy file
    fs.copyFileSync(srcPath, destPath);
  }
});

// Create admin directory and copy admin build
const adminDist = path.join(__dirname, '..', 'frontend', 'dist');
const adminDestDir = path.join(distDir, 'admin');

console.log('📁 Copying admin files to dist/admin...');
if (!fs.existsSync(adminDestDir)) {
  fs.mkdirSync(adminDestDir, { recursive: true });
}

const adminFiles = fs.readdirSync(adminDist);
adminFiles.forEach(file => {
  const srcPath = path.join(adminDist, file);
  const destPath = path.join(adminDestDir, file);
  
  if (fs.statSync(srcPath).isDirectory()) {
    // Copy directory recursively
    copyDir(srcPath, destPath);
  } else {
    // Copy file
    fs.copyFileSync(srcPath, destPath);
  }
});

// Helper function to copy directories recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

console.log('✅ Build combination complete!');
console.log('📂 Structure:');
console.log('  dist/ (storefront - root routes)');
console.log('  dist/admin/ (admin dashboard - /admin routes)');
