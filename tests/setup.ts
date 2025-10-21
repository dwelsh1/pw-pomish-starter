// Jest setup file for unit tests
import * as fs from 'fs';
import * as path from 'path';

// Create test directories if they don't exist
const testDirs = [
  'test-temp',
  'test-temp/steps-report',
  'test-temp/steps-report/1',
  'test-temp/steps-report/2'
];

testDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});