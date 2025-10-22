import { PromptGenerator } from '../../src/reporter/PromptGenerator';
import { TestResults } from '../../src/reporter/types';

describe('PromptGenerator', () => {
  let promptGenerator: PromptGenerator;

  beforeEach(() => {
    promptGenerator = new PromptGenerator();
  });

  describe('generatePrompt', () => {
    it('should generate a comprehensive prompt for failed test', () => {
      const testResult: TestResults = {
        num: 1,
        title: 'Test Login Functionality',
        fileName: 'tests/e2e/login.spec.ts',
        timeDuration: 5000,
        duration: '5s',
        description: 'This test verifies the login functionality works correctly',
        status: 'failed',
        browser: 'rbp-chromium',
        tags: ['@smoke', '@login'],
        preConditions: ['User is on the login page'],
        steps: ['Enter valid username and password', 'Click login button'],
        postConditions: ['User is logged in successfully'],
        statusIcon: '❌',
        videoPath: 'test-video.webm',
        screenshotPaths: ['test-screenshot.png'],
        attachments: [
          { name: 'trace', path: 'test-trace.zip' },
          { name: 'error-context', path: 'error-context.md' }
        ],
        errors: [
          'Error: expect(locator).toBeVisible()\n\nExpected: visible\nReceived: hidden'
        ]
      };

      const prompt = promptGenerator.generatePrompt(testResult);

      // Check that prompt contains all essential information
      expect(prompt).toContain('# Playwright Test Failure Analysis');
      expect(prompt).toContain('**Test:** Test Login Functionality');
      expect(prompt).toContain('**Status:** FAILED');
      expect(prompt).toContain('**Browser:** rbp-chromium');
      expect(prompt).toContain('**Duration:** 5s');
      expect(prompt).toContain('## Test Description');
      expect(prompt).toContain('This test verifies the login functionality works correctly');
      expect(prompt).toContain('## Pre-conditions');
      expect(prompt).toContain('1. User is on the login page');
      expect(prompt).toContain('## Test Steps');
      expect(prompt).toContain('1. Enter valid username and password');
      expect(prompt).toContain('2. Click login button');
      expect(prompt).toContain('## Post-conditions');
      expect(prompt).toContain('1. User is logged in successfully');
      expect(prompt).toContain('## Error Details');
      expect(prompt).toContain('### Error 1');
      expect(prompt).toContain('```');
      expect(prompt).toContain('Error: expect(locator).toBeVisible()');
      expect(prompt).toContain('## Test Location');
      expect(prompt).toContain('**File:** tests/e2e/login.spec.ts');
      expect(prompt).toContain('## Tags');
      expect(prompt).toContain('@smoke, @login');
      expect(prompt).toContain('## Available Attachments');
      expect(prompt).toContain('### Screenshots');
      expect(prompt).toContain('1. test-screenshot.png');
      expect(prompt).toContain('### Videos');
      expect(prompt).toContain('1. test-video.webm');
      expect(prompt).toContain('### Other Attachments');
      expect(prompt).toContain('1. test-trace.zip');
      expect(prompt).toContain('1. error-context');
      expect(prompt).toContain('## AI Analysis Request');
      expect(prompt).toContain('Please analyze this test failure and provide:');
      expect(prompt).toContain('1. **Root Cause Analysis:**');
      expect(prompt).toContain('2. **Potential Fixes:**');
      expect(prompt).toContain('3. **Prevention Strategies:**');
      expect(prompt).toContain('4. **Code Suggestions:**');
      expect(prompt).toContain('5. **Additional Context:**');
    });

    it('should handle test with minimal information', () => {
      const testResult: TestResults = {
        num: 1,
        title: 'Simple Test',
        fileName: 'tests/simple.spec.ts',
        timeDuration: 1000,
        duration: '1s',
        description: 'No Description',
        status: 'failed',
        browser: 'rbp-edge',
        tags: [],
        preConditions: ['No pre conditions'],
        steps: ['No steps'],
        postConditions: ['No post conditions'],
        statusIcon: '❌',
        videoPath: undefined,
        screenshotPaths: [],
        attachments: [],
        errors: ['Simple error message']
      };

      const prompt = promptGenerator.generatePrompt(testResult);

      expect(prompt).toContain('# Playwright Test Failure Analysis');
      expect(prompt).toContain('**Test:** Simple Test');
      expect(prompt).toContain('**Status:** FAILED');
      expect(prompt).toContain('**Browser:** rbp-edge');
      expect(prompt).toContain('**Duration:** 1s');
      expect(prompt).toContain('## Error Details');
      expect(prompt).toContain('Simple error message');
      // No attachments section should not be present when there are no attachments
      expect(prompt).not.toContain('## Available Attachments');
    });

    it('should handle multiple errors', () => {
      const testResult: TestResults = {
        num: 1,
        title: 'Multi Error Test',
        fileName: 'tests/multi-error.spec.ts',
        timeDuration: 3000,
        duration: '3s',
        description: 'Test with multiple errors',
        status: 'failed',
        browser: 'rbp-webkit',
        tags: ['@error'],
        preConditions: [],
        steps: [],
        postConditions: [],
        statusIcon: '❌',
        videoPath: undefined,
        screenshotPaths: [],
        attachments: [],
        errors: [
          'First error message',
          'Second error message',
          'Third error message'
        ]
      };

      const prompt = promptGenerator.generatePrompt(testResult);

      expect(prompt).toContain('### Error 1');
      expect(prompt).toContain('First error message');
      expect(prompt).toContain('### Error 2');
      expect(prompt).toContain('Second error message');
      expect(prompt).toContain('### Error 3');
      expect(prompt).toContain('Third error message');
    });

    it('should handle missing optional fields gracefully', () => {
      const testResult: TestResults = {
        num: 1,
        title: 'Minimal Test',
        fileName: 'tests/minimal.spec.ts',
        timeDuration: 500,
        duration: '500ms',
        description: undefined,
        status: 'failed',
        browser: 'rbp-chromium',
        tags: [],
        preConditions: [],
        steps: [],
        postConditions: [],
        statusIcon: '❌',
        videoPath: undefined,
        screenshotPaths: undefined,
        attachments: undefined,
        errors: ['Minimal error']
      };

      const prompt = promptGenerator.generatePrompt(testResult);

      expect(prompt).toContain('# Playwright Test Failure Analysis');
      expect(prompt).toContain('**Test:** Minimal Test');
      expect(prompt).toContain('**Status:** FAILED');
      expect(prompt).toContain('## Error Details');
      expect(prompt).toContain('Minimal error');
      // No attachments section should not be present when there are no attachments
      expect(prompt).not.toContain('## Available Attachments');
    });
  });

  describe('generateQuickPrompt', () => {
    it('should generate a concise prompt for quick analysis', () => {
      const testResult: TestResults = {
        num: 1,
        title: 'Quick Test',
        fileName: 'tests/quick.spec.ts',
        timeDuration: 2000,
        duration: '2s',
        description: 'Quick test description',
        status: 'failed',
        browser: 'rbp-chromium',
        tags: ['@quick'],
        preConditions: [],
        steps: [],
        postConditions: [],
        statusIcon: '❌',
        videoPath: undefined,
        screenshotPaths: [],
        attachments: [],
        errors: ['Quick error message']
      };

      const prompt = promptGenerator.generateQuickPrompt(testResult);

      expect(prompt).toContain('# Quick Test Failure Analysis: Quick Test');
      expect(prompt).toContain('**Status:** failed | **Browser:** rbp-chromium | **Duration:** 2s');
      expect(prompt).toContain('## Error');
      expect(prompt).toContain('```');
      expect(prompt).toContain('Quick error message');
      expect(prompt).toContain('## Request');
      expect(prompt).toContain('Please provide a quick analysis of this test failure and suggest the most likely fix.');
    });

    it('should handle test with no errors gracefully', () => {
      const testResult: TestResults = {
        num: 1,
        title: 'No Error Test',
        fileName: 'tests/no-error.spec.ts',
        timeDuration: 1000,
        duration: '1s',
        description: 'Test without errors',
        status: 'failed',
        browser: 'rbp-edge',
        tags: [],
        preConditions: [],
        steps: [],
        postConditions: [],
        statusIcon: '❌',
        videoPath: undefined,
        screenshotPaths: [],
        attachments: [],
        errors: []
      };

      const prompt = promptGenerator.generateQuickPrompt(testResult);

      expect(prompt).toContain('# Quick Test Failure Analysis: No Error Test');
      expect(prompt).toContain('**Status:** failed | **Browser:** rbp-edge | **Duration:** 1s');
      expect(prompt).toContain('## Request');
      expect(prompt).toContain('Please provide a quick analysis of this test failure and suggest the most likely fix.');
    });
  });

  describe('generateDebugPrompt', () => {
    it('should generate a focused debugging prompt', () => {
      const testResult: TestResults = {
        num: 1,
        title: 'Debug Test',
        fileName: 'tests/debug.spec.ts',
        timeDuration: 4000,
        duration: '4s',
        description: 'Debug test description',
        status: 'failed',
        browser: 'rbp-webkit',
        tags: ['@debug'],
        preConditions: [],
        steps: [],
        postConditions: [],
        statusIcon: '❌',
        videoPath: undefined,
        screenshotPaths: [],
        attachments: [],
        errors: ['Debug error message']
      };

      const prompt = promptGenerator.generateDebugPrompt(testResult);

      expect(prompt).toContain('# Debugging Assistance: Debug Test');
      expect(prompt).toContain('**Test:** Debug Test');
      expect(prompt).toContain('**Browser:** rbp-webkit');
      expect(prompt).toContain('**File:** tests/debug.spec.ts');
      expect(prompt).toContain('## Error Details');
      expect(prompt).toContain('```');
      expect(prompt).toContain('Debug error message');
      expect(prompt).toContain('## Debugging Request');
      expect(prompt).toContain('Help me debug this test failure. Focus on:');
      expect(prompt).toContain('- What went wrong and why');
      expect(prompt).toContain('- How to reproduce the issue');
      expect(prompt).toContain('- Specific debugging steps to take');
      expect(prompt).toContain('- What to look for in the screenshots/videos/traces');
    });

    it('should handle test with no errors gracefully', () => {
      const testResult: TestResults = {
        num: 1,
        title: 'No Error Debug Test',
        fileName: 'tests/no-error-debug.spec.ts',
        timeDuration: 1500,
        duration: '1s 500ms',
        description: 'Debug test without errors',
        status: 'failed',
        browser: 'rbp-chromium',
        tags: [],
        preConditions: [],
        steps: [],
        postConditions: [],
        statusIcon: '❌',
        videoPath: undefined,
        screenshotPaths: [],
        attachments: [],
        errors: []
      };

      const prompt = promptGenerator.generateDebugPrompt(testResult);

      expect(prompt).toContain('# Debugging Assistance: No Error Debug Test');
      expect(prompt).toContain('**Test:** No Error Debug Test');
      expect(prompt).toContain('**Browser:** rbp-chromium');
      expect(prompt).toContain('**File:** tests/no-error-debug.spec.ts');
      expect(prompt).toContain('## Debugging Request');
      expect(prompt).toContain('Help me debug this test failure. Focus on:');
    });
  });

  describe('edge cases', () => {
    it('should handle very long error messages', () => {
      const longError = 'A'.repeat(1000);
      const testResult: TestResults = {
        num: 1,
        title: 'Long Error Test',
        fileName: 'tests/long-error.spec.ts',
        timeDuration: 2000,
        duration: '2s',
        description: 'Test with long error',
        status: 'failed',
        browser: 'rbp-chromium',
        tags: [],
        preConditions: [],
        steps: [],
        postConditions: [],
        statusIcon: '❌',
        videoPath: undefined,
        screenshotPaths: [],
        attachments: [],
        errors: [longError]
      };

      const prompt = promptGenerator.generatePrompt(testResult);
      expect(prompt).toContain(longError);
    });

    it('should handle special characters in test data', () => {
      const testResult: TestResults = {
        num: 1,
        title: 'Special Chars Test "quotes" & symbols',
        fileName: 'tests/special-chars.spec.ts',
        timeDuration: 1000,
        duration: '1s',
        description: 'Test with special characters: <>&"\'',
        status: 'failed',
        browser: 'rbp-edge',
        tags: ['@special', '@chars'],
        preConditions: ['Pre-condition with "quotes"'],
        steps: ['Step with <tags>'],
        postConditions: ['Post-condition with & symbols'],
        statusIcon: '❌',
        videoPath: undefined,
        screenshotPaths: [],
        attachments: [],
        errors: ['Error with "quotes" and <tags>']
      };

      const prompt = promptGenerator.generatePrompt(testResult);
      expect(prompt).toContain('Special Chars Test "quotes" & symbols');
      expect(prompt).toContain('Test with special characters: <>&"\'');
      expect(prompt).toContain('Pre-condition with "quotes"');
      expect(prompt).toContain('Step with <tags>');
      expect(prompt).toContain('Post-condition with & symbols');
      expect(prompt).toContain('Error with "quotes" and <tags>');
    });

    it('should handle empty arrays and undefined values', () => {
      const testResult: TestResults = {
        num: 1,
        title: 'Empty Arrays Test',
        fileName: 'tests/empty-arrays.spec.ts',
        timeDuration: 500,
        duration: '500ms',
        description: 'Test with empty arrays',
        status: 'failed',
        browser: 'rbp-webkit',
        tags: [],
        preConditions: [],
        steps: [],
        postConditions: [],
        statusIcon: '❌',
        videoPath: undefined,
        screenshotPaths: [],
        attachments: [],
        errors: []
      };

      const prompt = promptGenerator.generatePrompt(testResult);
      expect(prompt).toContain('# Playwright Test Failure Analysis');
      expect(prompt).toContain('**Test:** Empty Arrays Test');
      // No attachments section should not be present when there are no attachments
      expect(prompt).not.toContain('No attachments available.');
    });
  });
});
