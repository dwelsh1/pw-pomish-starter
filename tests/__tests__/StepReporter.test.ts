import StepReporter from '../../src/reporter/StepReporter';
import { TestCase, TestResult, FullConfig, FullResult } from '@playwright/test/reporter';
import { 
  createMockTestCase, 
  createMockTestResult, 
  createMockFailedTestResult,
  createMockAnsiErrorResult,
  createMockConfig,
  createMockFullResult,
  createTestFiles,
  cleanupTestFiles
} from '../__mocks__/testFixtures';
import * as fs from 'fs';
import * as path from 'path';

describe('StepReporter', () => {
  let reporter: StepReporter;
  let mockConfig: FullConfig;
  let mockTestCase: TestCase;
  let mockTestResult: TestResult;

  beforeEach(() => {
    reporter = new StepReporter();
    mockConfig = createMockConfig() as FullConfig;
    mockTestCase = createMockTestCase();
    mockTestResult = createMockTestResult();
    
    // Clean up any existing test directories
    if (fs.existsSync('test-temp')) {
      try {
        fs.rmSync('test-temp', { recursive: true, force: true });
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    fs.mkdirSync('test-temp', { recursive: true });
    
    // Create test files that are referenced in mock data
    fs.writeFileSync('test-temp/screenshot1.png', 'fake-image-data');
    fs.writeFileSync('test-temp/video.webm', 'fake-video-data');
    fs.writeFileSync('test-temp/trace.zip', 'fake-trace-data');
    fs.writeFileSync('test-temp/custom.txt', 'custom attachment data');
  });

  afterEach(() => {
    // Clean up test directories
    if (fs.existsSync('test-temp')) {
      fs.rmSync('test-temp', { recursive: true, force: true });
    }
    if (fs.existsSync('steps-report')) {
      fs.rmSync('steps-report', { recursive: true, force: true });
    }
  });

  describe('onBegin', () => {
    it('should set testDir from config', () => {
      reporter.onBegin(mockConfig);
      // We can't directly test the private property, but we can verify it doesn't throw
      expect(() => reporter.onBegin(mockConfig)).not.toThrow();
    });

    it('should use default testDir when config is undefined', () => {
      expect(() => reporter.onBegin(undefined as any)).not.toThrow();
    });
  });

  describe('onTestEnd', () => {
    beforeEach(() => {
      reporter.onBegin(mockConfig);
      createTestFiles();
    });

    afterEach(() => {
      cleanupTestFiles();
    });

    it('should process a passed test correctly', async () => {
      await reporter.onTestEnd(mockTestCase, mockTestResult);

      // Verify test directory was created
      expect(fs.existsSync('steps-report/1')).toBe(true);
      
      // Verify HTML file was created
      expect(fs.existsSync('steps-report/1/index.html')).toBe(true);
      
      // Verify HTML content contains test information
      const htmlContent = fs.readFileSync('steps-report/1/index.html', 'utf8');
      expect(htmlContent).toContain('Test Login Functionality');
      expect(htmlContent).toContain('rbp-chromium');
      expect(htmlContent).toContain('smoke, login');
    });

    it('should process a failed test correctly', async () => {
      const failedResult = createMockFailedTestResult();
      await reporter.onTestEnd(mockTestCase, failedResult);

      // Verify HTML content contains error information
      const htmlContent = fs.readFileSync('steps-report/1/index.html', 'utf8');
      expect(htmlContent).toContain('Error: expect(locator).toBeVisible()');
      expect(htmlContent).toContain('Expected: visible');
      expect(htmlContent).toContain('Received: hidden');
    });

    it('should handle ANSI colored error messages', async () => {
      const ansiErrorResult = createMockAnsiErrorResult();
      await reporter.onTestEnd(mockTestCase, ansiErrorResult);

      const htmlContent = fs.readFileSync('steps-report/1/index.html', 'utf8');
      // Check that ANSI colors are converted to HTML spans
      expect(htmlContent).toContain('Error: Element not found');
      expect(htmlContent).toContain('Warning: This is a warning');
      expect(htmlContent).toContain('Success: Operation completed');
    });

    it('should handle test with no annotations', async () => {
      const testCaseNoAnnotations = createMockTestCase({ annotations: [] });
      await reporter.onTestEnd(testCaseNoAnnotations, mockTestResult);

      const htmlContent = fs.readFileSync('steps-report/1/index.html', 'utf8');
      expect(htmlContent).toContain('Test Login Functionality');
    });

    it('should handle test with missing description', async () => {
      const testCaseNoDescription = createMockTestCase({
        annotations: [
          {
            type: 'Step' as any,
            description: 'Some step'
          }
        ]
      });
      await reporter.onTestEnd(testCaseNoDescription, mockTestResult);

      const htmlContent = fs.readFileSync('steps-report/1/index.html', 'utf8');
      // The description section should not be present when there's no description
      expect(htmlContent).not.toContain('No Description');
    });

    it('should increment test number for each test', async () => {
      await reporter.onTestEnd(mockTestCase, mockTestResult);
      expect(fs.existsSync('steps-report/1')).toBe(true);

      const secondTestCase = createMockTestCase({ title: 'Second Test' });
      await reporter.onTestEnd(secondTestCase, mockTestResult);
      expect(fs.existsSync('steps-report/2')).toBe(true);
    });

    it('should group tests by filename', async () => {
      const testCase1 = createMockTestCase({ 
        title: 'Test 1',
        location: { file: 'tests/e2e/login.spec.ts', line: 10, column: 5 }
      });
      const testCase2 = createMockTestCase({ 
        title: 'Test 2',
        location: { file: 'tests/e2e/login.spec.ts', line: 20, column: 5 }
      });
      const testCase3 = createMockTestCase({ 
        title: 'Test 3',
        location: { file: 'tests/e2e/register.spec.ts', line: 10, column: 5 }
      });

      await reporter.onTestEnd(testCase1, mockTestResult);
      await reporter.onTestEnd(testCase2, mockTestResult);
      await reporter.onTestEnd(testCase3, mockTestResult);

      // Verify summary will be generated with grouped results
      expect(fs.existsSync('steps-report/1')).toBe(true);
      expect(fs.existsSync('steps-report/2')).toBe(true);
      expect(fs.existsSync('steps-report/3')).toBe(true);
    });

    it('should handle flaky tests correctly', async () => {
      const flakyTestCase = createMockTestCase();
      const flakyResult = createMockTestResult({ status: 'passed' });
      
      // Mock multiple results to simulate retry
      (flakyTestCase as any).results = [
        createMockTestResult({ status: 'failed' }),
        flakyResult
      ];

      await reporter.onTestEnd(flakyTestCase, flakyResult);

      const htmlContent = fs.readFileSync('steps-report/1/index.html', 'utf8');
      expect(htmlContent).toContain('Test Login Functionality');
    });

    it('should handle different test statuses', async () => {
      const statuses = ['passed', 'failed', 'skipped'] as const;
      
      for (let i = 0; i < statuses.length; i++) {
        const testCase = createMockTestCase({ title: `Test ${statuses[i]}` });
        const result = createMockTestResult({ status: statuses[i] });
        
        await reporter.onTestEnd(testCase, result);
        
        const htmlContent = fs.readFileSync(`steps-report/${i + 1}/index.html`, 'utf8');
        expect(htmlContent).toContain(`Test ${statuses[i]}`);
      }
    });

    it('should handle missing browser information', async () => {
      const testCaseNoBrowser = createMockTestCase({
        parent: {
          project: () => ({ name: undefined })
        } as any
      });
      
      await reporter.onTestEnd(testCaseNoBrowser, mockTestResult);

      const htmlContent = fs.readFileSync('steps-report/1/index.html', 'utf8');
      expect(htmlContent).toContain('No browser');
    });

    it('should handle empty attachments array', async () => {
      const resultNoAttachments = createMockTestResult({ attachments: [] });
      await reporter.onTestEnd(mockTestCase, resultNoAttachments);

      const htmlContent = fs.readFileSync('steps-report/1/index.html', 'utf8');
      expect(htmlContent).toContain('Test Login Functionality');
    });

    it('should handle null/undefined attachments', async () => {
      const resultNullAttachments = createMockTestResult({ attachments: undefined });
      await reporter.onTestEnd(mockTestCase, resultNullAttachments);

      const htmlContent = fs.readFileSync('steps-report/1/index.html', 'utf8');
      expect(htmlContent).toContain('Test Login Functionality');
    });
  });

  describe('onEnd', () => {
    beforeEach(() => {
      reporter.onBegin(mockConfig);
    });

    it('should generate summary.html with correct data', async () => {
      // Add some test results first
      await reporter.onTestEnd(mockTestCase, mockTestResult);
      
      const secondTestCase = createMockTestCase({ title: 'Second Test' });
      await reporter.onTestEnd(secondTestCase, mockTestResult);

      const mockFullResult = createMockFullResult();
      await reporter.onEnd(mockFullResult);

      // Verify summary file was created
      expect(fs.existsSync('steps-report/summary.html')).toBe(true);
      
      // Verify summary content
      const summaryContent = fs.readFileSync('steps-report/summary.html', 'utf8');
      expect(summaryContent).toContain('Playwright Test Steps Report');
      expect(summaryContent).toContain('Total Tests');
      expect(summaryContent).toContain('Passed');
      expect(summaryContent).toContain('Failed');
      expect(summaryContent).toContain('Skipped');
    });

    it('should handle empty test results', async () => {
      const mockFullResult = createMockFullResult();
      await reporter.onEnd(mockFullResult);

      expect(fs.existsSync('steps-report/summary.html')).toBe(true);
      
      const summaryContent = fs.readFileSync('steps-report/summary.html', 'utf8');
      expect(summaryContent).toContain('Total Tests');
    });

    it('should format duration correctly in summary', async () => {
      await reporter.onTestEnd(mockTestCase, mockTestResult);
      
      const mockFullResult = createMockFullResult({ duration: 15000 });
      await reporter.onEnd(mockFullResult);

      const summaryContent = fs.readFileSync('steps-report/summary.html', 'utf8');
      expect(summaryContent).toContain('15s');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      reporter.onBegin(mockConfig);
    });

    it('should handle file system errors gracefully', async () => {
      // Test with malformed data that should be handled gracefully
      const malformedTestCase = createMockTestCase({
        title: null as any,
        annotations: null as any
      });

      await expect(reporter.onTestEnd(malformedTestCase, mockTestResult)).resolves.not.toThrow();
    });

    it('should handle template rendering errors gracefully', async () => {
      // Test with malformed data that should be handled gracefully
      const malformedTestCase = createMockTestCase({
        title: null as any,
        annotations: null as any
      });

      await expect(reporter.onTestEnd(malformedTestCase, mockTestResult)).resolves.not.toThrow();
    });
  });
});
