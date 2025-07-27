#!/usr/bin/env node

/**
 * CitySync Plus Development Server Starter
 * Handles SWC binary issues and provides fallback options
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting CitySync Plus Development Server...\n');

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
try {
  require(packageJsonPath);
} catch (error) {
  console.error('❌ Error: package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Function to run a command
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Main function
async function startDev() {
  try {
    console.log('📦 Installing dependencies...');
    await runCommand('npm', ['install']);
    
    console.log('🔧 Building project...');
    await runCommand('npm', ['run', 'build']);
    
    console.log('🌐 Starting development server...');
    console.log('📍 Server will be available at: http://localhost:3000');
    console.log('🛑 Press Ctrl+C to stop the server\n');
    
    await runCommand('npm', ['run', 'dev']);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Development server stopped.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Development server stopped.');
  process.exit(0);
});

// Start the development process
startDev();
