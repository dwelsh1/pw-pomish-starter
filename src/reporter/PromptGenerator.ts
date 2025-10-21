import { TestCase, TestResult } from '@playwright/test/reporter';
import { TestResults } from './types';

export interface PromptData {
  testTitle: string;
  testDescription?: string;
  testSteps: string[];
  preConditions: string[];
  postConditions: string[];
  browser: string;
  testStatus: string;
  duration: string;
  errorMessages: string[];
  attachments: {
    screenshots: string[];
    videos: string[];
    traces: string[];
    other: string[];
  };
  testLocation: {
    file: string;
    line: number;
    column: number;
  };
  tags: string[];
  timestamp: string;
}

export class PromptGenerator {
  /**
   * Generates a comprehensive AI-friendly prompt from test failure data
   */
  generatePrompt(testResults: TestResults): string {
    const promptData = this.extractPromptData(testResults);
    return this.formatPrompt(promptData);
  }

  /**
   * Extracts structured data from TestResults for prompt generation
   */
  private extractPromptData(testResults: TestResults): PromptData {
    const attachments = this.categorizeAttachments(testResults.attachments || []);
    
    return {
      testTitle: testResults.title,
      testDescription: testResults.description,
      testSteps: testResults.steps,
      preConditions: testResults.preConditions,
      postConditions: testResults.postConditions,
      browser: testResults.browser,
      testStatus: testResults.status,
      duration: testResults.duration,
      errorMessages: testResults.errors || [],
      attachments: {
        screenshots: testResults.screenshotPaths || [],
        videos: testResults.videoPath ? [testResults.videoPath] : [],
        traces: attachments.traces,
        other: attachments.other
      },
      testLocation: {
        file: testResults.fileName,
        line: 0, // Not available in current TestResults interface
        column: 0 // Not available in current TestResults interface
      },
      tags: testResults.tags,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Categorizes attachments by type
   */
  private categorizeAttachments(attachments: { path: string; name: string }[]): {
    traces: string[];
    other: string[];
  } {
    const traces: string[] = [];
    const other: string[] = [];

    attachments.forEach(attachment => {
      if (attachment.name.toLowerCase().includes('trace')) {
        traces.push(attachment.path);
      } else {
        other.push(attachment.path);
      }
    });

    return { traces, other };
  }

  /**
   * Formats the extracted data into a comprehensive AI prompt
   */
  private formatPrompt(data: PromptData): string {
    const sections: string[] = [];

    // Header
    sections.push('# Playwright Test Failure Analysis');
    sections.push('');
    sections.push(`**Test:** ${data.testTitle}`);
    sections.push(`**Status:** ${data.testStatus.toUpperCase()}`);
    sections.push(`**Browser:** ${data.browser}`);
    sections.push(`**Duration:** ${data.duration}`);
    sections.push(`**Timestamp:** ${data.timestamp}`);
    sections.push('');

    // Test Description
    if (data.testDescription && data.testDescription !== 'No Description') {
      sections.push('## Test Description');
      sections.push(data.testDescription);
      sections.push('');
    }

    // Test Steps
    if (data.testSteps.length > 0) {
      sections.push('## Test Steps');
      data.testSteps.forEach((step, index) => {
        sections.push(`${index + 1}. ${step}`);
      });
      sections.push('');
    }

    // Pre-conditions
    if (data.preConditions.length > 0) {
      sections.push('## Pre-conditions');
      data.preConditions.forEach((condition, index) => {
        sections.push(`${index + 1}. ${condition}`);
      });
      sections.push('');
    }

    // Post-conditions
    if (data.postConditions.length > 0) {
      sections.push('## Post-conditions');
      data.postConditions.forEach((condition, index) => {
        sections.push(`${index + 1}. ${condition}`);
      });
      sections.push('');
    }

    // Error Messages
    if (data.errorMessages.length > 0) {
      sections.push('## Error Details');
      data.errorMessages.forEach((error, index) => {
        sections.push(`### Error ${index + 1}`);
        sections.push('```');
        sections.push(this.cleanErrorMessage(error));
        sections.push('```');
        sections.push('');
      });
    }

    // Test Location
    sections.push('## Test Location');
    sections.push(`**File:** ${data.testLocation.file}`);
    sections.push('');

    // Tags
    if (data.tags.length > 0) {
      sections.push('## Tags');
      sections.push(data.tags.join(', '));
      sections.push('');
    }

    // Attachments
    const hasAttachments = data.attachments.screenshots.length > 0 ||
                          data.attachments.videos.length > 0 ||
                          data.attachments.traces.length > 0 ||
                          data.attachments.other.length > 0;

    if (hasAttachments) {
      sections.push('## Available Attachments');
      
      if (data.attachments.screenshots.length > 0) {
        sections.push('### Screenshots');
        data.attachments.screenshots.forEach((screenshot, index) => {
          sections.push(`${index + 1}. ${screenshot}`);
        });
        sections.push('');
      }

      if (data.attachments.videos.length > 0) {
        sections.push('### Videos');
        data.attachments.videos.forEach((video, index) => {
          sections.push(`${index + 1}. ${video}`);
        });
        sections.push('');
      }

      if (data.attachments.traces.length > 0) {
        sections.push('### Traces');
        data.attachments.traces.forEach((trace, index) => {
          sections.push(`${index + 1}. ${trace}`);
        });
        sections.push('');
      }

      if (data.attachments.other.length > 0) {
        sections.push('### Other Attachments');
        data.attachments.other.forEach((attachment, index) => {
          sections.push(`${index + 1}. ${attachment}`);
        });
        sections.push('');
      }
    }

    // AI Instructions
    sections.push('## AI Analysis Request');
    sections.push('');
    sections.push('Please analyze this test failure and provide:');
    sections.push('');
    sections.push('1. **Root Cause Analysis:** What likely caused this test to fail?');
    sections.push('2. **Potential Fixes:** Specific steps to resolve the issue');
    sections.push('3. **Prevention Strategies:** How to prevent similar failures in the future');
    sections.push('4. **Code Suggestions:** If applicable, provide code examples or modifications');
    sections.push('5. **Additional Context:** Any other insights that might be helpful');
    sections.push('');
    sections.push('Focus on actionable solutions and consider the test steps, error messages, and available attachments when providing your analysis.');

    return sections.join('\n');
  }

  /**
   * Cleans error messages by removing ANSI codes and formatting
   */
  private cleanErrorMessage(error: string): string {
    return error
      // Remove ANSI color codes
      .replace(/\u001b\[[0-9;]*m/g, '')
      // Clean up extra whitespace
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  /**
   * Generates a shorter prompt for quick analysis
   */
  generateQuickPrompt(testResults: TestResults): string {
    const promptData = this.extractPromptData(testResults);
    
    const sections: string[] = [];
    sections.push(`# Quick Test Failure Analysis: ${promptData.testTitle}`);
    sections.push('');
    sections.push(`**Status:** ${promptData.testStatus} | **Browser:** ${promptData.browser} | **Duration:** ${promptData.duration}`);
    sections.push('');
    
    if (promptData.errorMessages.length > 0) {
      sections.push('## Error');
      sections.push('```');
      sections.push(this.cleanErrorMessage(promptData.errorMessages[0]));
      sections.push('```');
      sections.push('');
    }
    
    sections.push('## Request');
    sections.push('Please provide a quick analysis of this test failure and suggest the most likely fix.');
    
    return sections.join('\n');
  }

  /**
   * Generates a prompt specifically for debugging assistance
   */
  generateDebugPrompt(testResults: TestResults): string {
    const promptData = this.extractPromptData(testResults);
    
    const sections: string[] = [];
    sections.push(`# Debugging Assistance: ${promptData.testTitle}`);
    sections.push('');
    sections.push(`**Test:** ${promptData.testTitle}`);
    sections.push(`**Browser:** ${promptData.browser}`);
    sections.push(`**File:** ${promptData.testLocation.file}`);
    sections.push('');
    
    if (promptData.testSteps.length > 0) {
      sections.push('## Test Steps');
      promptData.testSteps.forEach((step, index) => {
        sections.push(`${index + 1}. ${step}`);
      });
      sections.push('');
    }
    
    if (promptData.errorMessages.length > 0) {
      sections.push('## Error Details');
      sections.push('```');
      sections.push(this.cleanErrorMessage(promptData.errorMessages[0]));
      sections.push('```');
      sections.push('');
    }
    
    sections.push('## Debugging Request');
    sections.push('Help me debug this test failure. Focus on:');
    sections.push('- What went wrong and why');
    sections.push('- How to reproduce the issue');
    sections.push('- Specific debugging steps to take');
    sections.push('- What to look for in the screenshots/videos/traces');
    
    return sections.join('\n');
  }
}
