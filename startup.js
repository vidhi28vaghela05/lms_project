#!/usr/bin/env node
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkMongoDBConnection() {
  return new Promise((resolve) => {
    const data = JSON.stringify({ status: 'check' });
    const options = {
      hostname: 'localhost',
      port: 27017,
      path: '/',
      method: 'GET',
      timeout: 2000
    };

    const req = http.request(options, () => {
      resolve(true);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function startApplication() {
  try {
    // Check MongoDB
    log('\n=== LMS Application Startup ===\n', 'cyan');
    log('Checking MongoDB connection...', 'blue');

    const mongoRunning = await checkMongoDBConnection();

    if (!mongoRunning) {
      log('WARNING: MongoDB is not running!', 'yellow');
      log('Please start MongoDB with: mongod', 'yellow');
      log('Continuing anyway (some features may not work)...\n', 'yellow');
    } else {
      log('MongoDB is running ✓\n', 'green');
    }

    // Seed database if MongoDB is available
    if (mongoRunning) {
      log('Seeding database with test users...', 'blue');
      const seedResult = await runSeedDatabase();
      if (seedResult) {
        log('Database seeded ✓\n', 'green');
      } else {
        log('Seed completed (or users already exist)\n', 'green');
      }
    }

    // Start backend and frontend concurrently
    log('Starting Backend and Frontend services...', 'blue');
    log('Backend:  http://localhost:3000', 'cyan');
    log('Frontend: http://localhost:5173\n', 'cyan');

    const backendProcess = spawn('npm', ['start'], {
      cwd: path.join(__dirname, '../backend'),
      stdio: 'inherit'
    });

    const frontendProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '../frontend'),
      stdio: 'inherit'
    });

    // Wait for backend to start (2 seconds), then open browser
    setTimeout(() => {
      openBrowser();
    }, 3000);

    // Handle process termination
    process.on('SIGINT', () => {
      log('\n\nShutting down services...', 'blue');
      backendProcess.kill();
      frontendProcess.kill();
      process.exit(0);
    });

  } catch (error) {
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

function runSeedDatabase() {
  return new Promise((resolve) => {
    const seedProcess = spawn('node', ['seed.js'], {
      cwd: path.join(__dirname, '../backend'),
      stdio: 'pipe'
    });

    let output = '';
    seedProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    seedProcess.stderr.on('data', (data) => {
      output += data.toString();
    });

    seedProcess.on('close', (code) => {
      resolve(code === 0);
    });

    seedProcess.on('error', () => {
      resolve(false);
    });
  });
}

function openBrowser() {
  const url = 'http://localhost:3000';
  log(`\nOpening browser at ${url}...`, 'green');

  const platform = process.platform;
  let command;

  if (platform === 'darwin') {
    // macOS
    command = `open ${url}`;
  } else if (platform === 'win32') {
    // Windows
    command = `start ${url}`;
  } else {
    // Linux
    command = `xdg-open ${url}`;
  }

  require('child_process').exec(command, (error) => {
    if (error) {
      log(`Browser not auto-opened. Please visit ${url} manually`, 'yellow');
    }
  });

  log('\n✅ Application is running!', 'green');
  log('\nTest Credentials:', 'cyan');
  log('  Student:    student@lms.com / password123', 'cyan');
  log('  Instructor: instructor@lms.com / password123', 'cyan');
  log('  Admin:      admin@lms.com / admin123', 'cyan');
  log('\nPress Ctrl+C to stop the application\n', 'yellow');
}

// Start the application
startApplication().catch(error => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
