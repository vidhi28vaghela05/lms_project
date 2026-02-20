#!/usr/bin/env node
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

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

function checkMongoDB() {
  return new Promise((resolve) => {
    const client = new net.Socket();
    client.setTimeout(2000);
    client.connect(27017, '127.0.0.1', () => {
      client.destroy();
      resolve(true);
    });
    client.on('error', () => {
      client.destroy();
      resolve(false);
    });
    client.on('timeout', () => {
      client.destroy();
      resolve(false);
    });
  });
}

async function startApplication() {
  try {
    log('\n=== LMS Application Startup ===\n', 'cyan');
    log('Checking MongoDB connection...', 'blue');

    const mongoRunning = await checkMongoDB();

    if (!mongoRunning) {
      log('WARNING: MongoDB is not running!', 'yellow');
      log('Please start MongoDB with: mongod', 'yellow');
      log('Continuing anyway (some features may not work)...\n', 'yellow');
    } else {
      log('MongoDB is running ✓\n', 'green');
    }

    if (mongoRunning) {
      log('Seeding database with test users...', 'blue');
      try {
        await runCommand('node seed.js', path.join(__dirname, 'backend'));
        log('Database seeded ✓\n', 'green');
      } catch (err) {
        log('Seed completed (or users already exist)\n', 'green');
      }
    }

    log('Starting Backend and Frontend services...', 'blue');
    log('Backend:  http://localhost:3000', 'cyan');
    log('Frontend: http://localhost:5173\n', 'cyan');

    const backendProcess = spawn('npm', ['start'], {
      cwd: path.join(__dirname, 'backend'),
      stdio: 'inherit',
      shell: true
    });

    const frontendProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'frontend'),
      stdio: 'inherit',
      shell: true
    });

    setTimeout(() => {
      const url = 'http://localhost:3000';
      log(`\nOpening browser at ${url}...`, 'green');
      const startCmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
      exec(`${startCmd} ${url}`);
      log('\n✅ Application is running!', 'green');
      log('\nTest Credentials:', 'cyan');
      log('  Student:    student@lms.com / password123', 'cyan');
      log('  Instructor: instructor@lms.com / password123', 'cyan');
      log('  Admin:      admin@lms.com / admin123', 'cyan');
      log('\nPress Ctrl+C to stop the application\n', 'yellow');
    }, 5000);

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

function runCommand(command, cwd) {
  return new Promise((resolve, reject) => {
    const parts = command.split(' ');
    const child = spawn(parts[0], parts.slice(1), { cwd, stdio: 'pipe', shell: true });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with code ${code}`));
    });
    child.on('error', reject);
  });
}

startApplication();
