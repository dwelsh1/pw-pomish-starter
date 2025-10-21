import { TestCase, TestResult } from '@playwright/test/reporter';
import { AnnotationType } from '../../src/reporter/types';

// Mock TestCase data
export const createMockTestCase = (overrides: Partial<TestCase> = {}): TestCase => {
  return {
    title: 'Test Login Functionality',
    location: {
      file: 'tests/e2e/login.spec.ts',
      line: 10,
      column: 5
    },
    tags: ['@smoke', '@login'],
    annotations: [
      {
        type: AnnotationType.Description,
        description: 'This test verifies the login functionality works correctly'
      },
      {
        type: AnnotationType.Precondition,
        description: 'User is on the login page'
      },
      {
        type: AnnotationType.Step,
        description: 'Enter valid username and password'
      },
      {
        type: AnnotationType.Step,
        description: 'Click login button'
      },
      {
        type: AnnotationType.Assert,
        description: 'Verify user is redirected to dashboard'
      },
      {
        type: AnnotationType.PostCondition,
        description: 'User is logged in successfully'
      }
    ],
    parent: {
      project: () => ({
        name: 'rbp-chromium'
      })
    } as any,
    results: [],
    ...overrides
  } as TestCase;
};

// Mock TestResult data
export const createMockTestResult = (overrides: Partial<TestResult> = {}): TestResult => {
  return {
    status: 'passed',
    duration: 2500,
    errors: [],
    attachments: [
      {
        name: 'screenshot',
        path: 'test-temp/screenshot1.png',
        contentType: 'image/png',
        body: Buffer.from('fake-image-data')
      },
      {
        name: 'video',
        path: 'test-temp/video.webm',
        contentType: 'video/webm',
        body: Buffer.from('fake-video-data')
      },
      {
        name: 'trace',
        path: 'test-temp/trace.zip',
        contentType: 'application/zip',
        body: Buffer.from('fake-trace-data')
      },
      {
        name: 'custom-attachment',
        path: 'test-temp/custom.txt',
        contentType: 'text/plain',
        body: Buffer.from('custom attachment data')
      }
    ],
    ...overrides
  } as TestResult;
};

// Mock failed TestResult with errors
export const createMockFailedTestResult = (overrides: Partial<TestResult> = {}): TestResult => {
  return {
    status: 'failed',
    duration: 5000,
    errors: [
      {
        message: 'Error: expect(locator).toBeVisible()\n\nExpected: visible\nReceived: hidden',
        stack: 'Error: expect(locator).toBeVisible()\n    at Object.<anonymous> (tests/e2e/login.spec.ts:15:5)\n    at async Test.step (tests/e2e/login.spec.ts:14:5)'
      }
    ],
    attachments: [
      {
        name: 'screenshot',
        path: 'test-temp/failure-screenshot.png',
        contentType: 'image/png',
        body: Buffer.from('failure-screenshot-data')
      },
      {
        name: 'video',
        path: 'test-temp/failure-video.webm',
        contentType: 'video/webm',
        body: Buffer.from('failure-video-data')
      }
    ],
    annotations: [],
    parallelIndex: 0,
    retry: 0,
    startTime: new Date(),
    workerIndex: 0,
    ...overrides
  } as TestResult;
};

// Mock TestResult with ANSI colored errors
export const createMockAnsiErrorResult = (): TestResult => {
  return {
    status: 'failed',
    duration: 3000,
    errors: [
      {
        message: '\u001b[31mError: Element not found\u001b[0m\n\u001b[33mWarning: This is a warning\u001b[0m\n\u001b[32mSuccess: Operation completed\u001b[0m',
        stack: 'Error: Element not found\n    at Object.<anonymous> (tests/e2e/test.spec.ts:10:5)'
      }
    ],
    attachments: [],
    annotations: [],
    parallelIndex: 0,
    retry: 0,
    startTime: new Date(),
    workerIndex: 0,
    stderr: [],
    stdout: [],
    steps: []
  } as TestResult;
};

// Mock FullConfig
export const createMockConfig = () => {
  return {
    rootDir: 'tests',
    projects: [
      {
        name: 'rbp-chromium',
        testDir: 'tests/e2e'
      }
    ]
  };
};

// Mock FullResult
export const createMockFullResult = (overrides: any = {}) => {
  return {
    status: 'passed',
    duration: 10000,
    ...overrides
  };
};

// Test file paths for file operations
export const TEST_FILE_PATHS = {
  screenshot: 'test-temp/test-screenshot.png',
  video: 'test-temp/test-video.webm',
  attachment: 'test-temp/test-attachment.txt',
  nonExistent: 'test-temp/non-existent.txt'
};

// Create test files for file operation tests
export const createTestFiles = () => {
  const fs = require('fs');
  const path = require('path');
  
  // Create test files
  fs.writeFileSync(TEST_FILE_PATHS.screenshot, 'fake screenshot data');
  fs.writeFileSync(TEST_FILE_PATHS.video, 'fake video data');
  fs.writeFileSync(TEST_FILE_PATHS.attachment, 'fake attachment data');
};

// Clean up test files
export const cleanupTestFiles = () => {
  const fs = require('fs');
  
  Object.values(TEST_FILE_PATHS).forEach(filePath => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
};
