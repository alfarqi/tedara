// Test script for asset path generation
// This can be run in the browser console to test asset path generation

import { getAssetPath } from './assets';
import { getUserAvatar } from './authUtils';

export const testAssetPaths = () => {
  console.log('🧪 Testing Asset Path Generation');
  console.log('================================');
  
  // Test the getAssetPath function
  const testPaths = [
    '/assets/images/users/user-2.jpg',
    '/assets/images/logo.png',
    '/assets/images/products/1.png',
    'assets/images/users/user-1.jpg', // without leading slash
  ];
  
  testPaths.forEach(path => {
    const result = getAssetPath(path);
    console.log(`Input: ${path}`);
    console.log(`Output: ${result}`);
    console.log('---');
  });
  
  // Test user avatar helper
  console.log('👤 Testing User Avatar Helper');
  console.log('=============================');
  
  const testUsers = [
    { name: 'John Doe', avatar: null },
    { name: 'Jane Smith', avatar: 'https://example.com/avatar.jpg' },
    { name: 'Bob Wilson', avatar: '/uploads/avatars/bob.jpg' },
  ];
  
  testUsers.forEach(user => {
    const avatar = getUserAvatar(user, user.avatar);
    console.log(`User: ${user.name}`);
    console.log(`Avatar: ${avatar}`);
    console.log('---');
  });
  
  console.log('✅ Asset path testing complete!');
};

// Make functions available globally for testing
declare global {
  interface Window {
    testAssetPaths: () => void;
  }
}

if (typeof window !== 'undefined') {
  window.testAssetPaths = testAssetPaths;
}
