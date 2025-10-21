import { FullConfig, FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { OrtoniReportConfig } from 'ortoni-report';
import * as fs from 'fs';
import * as path from 'path';
import { PromptGenerator } from './PromptGenerator';
import { TestResults } from './types';

interface OrtoniTestData {
  suiteHierarchy: string;
  key: string;
  annotations: any[];
  testTags: string[];
  location: string;
  retryAttemptCount: number;
  projectName: string;
  suite: string;
  title: string;
  status: string;
  flaky: string;
  duration: number;
  errors: string[];
  steps: any[];
  logs: string;
  filePath: string;
  filters: any;
  base64Image: boolean;
  testId: string;
  screenshots: string[];
  videoPath: string[];
  index: number;
  prompts?: {
    full: string;
    quick: string;
    debug: string;
  };
}

export default class OrtoniCopyPromptReporter implements Reporter {
  private config: OrtoniReportConfig;
  private promptGenerator: PromptGenerator;
  private testData: Map<string, OrtoniTestData> = new Map();

  constructor(config: OrtoniReportConfig) {
    this.config = config;
    this.promptGenerator = new PromptGenerator();
  }

  onBegin(config: FullConfig, suite: any) {
    // Initialize the reporter
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    // Generate AI prompts for failed tests
    if (result.status === 'failed') {
      const testResults: TestResults = this.convertToTestResults(test, result);
      const fullPrompt = this.promptGenerator.generatePrompt(testResults);
      const quickPrompt = this.promptGenerator.generateQuickPrompt(testResults);
      const debugPrompt = this.promptGenerator.generateDebugPrompt(testResults);

      // Store prompts for this test
      const testKey = `${test.location.file}:${test.parent.project()?.name}:${test.title}`;
      this.testData.set(testKey, {
        suiteHierarchy: test.parent?.title || 'Unknown Suite',
        key: testKey,
        annotations: test.annotations || [],
        testTags: test.tags || [],
        location: `${test.location.file}:${test.location.line}:${test.location.column}`,
        retryAttemptCount: result.retry,
        projectName: test.parent.project()?.name || 'Unknown Project',
        suite: test.parent?.title || 'Unknown Suite',
        title: test.title,
        status: result.status,
        flaky: 'expected',
        duration: result.duration,
        errors: result.errors.map(error => error.message),
        steps: result.steps || [],
        logs: result.stdout?.join('\n') || '',
        filePath: test.location.file,
        filters: {},
        base64Image: false,
        testId: testKey,
        screenshots: result.attachments
          .filter(att => att.name === 'screenshot')
          .map(att => att.path || ''),
        videoPath: result.attachments
          .filter(att => att.name === 'video')
          .map(att => att.path || ''),
        index: 0,
        prompts: {
          full: fullPrompt,
          quick: quickPrompt,
          debug: debugPrompt
        }
      });
    }
  }

  async onEnd(result: FullResult) {
    // Inject Copy Prompt functionality into the Ortoni report
    await this.injectCopyPromptFeature();
  }

  private convertToTestResults(test: TestCase, result: TestResult): TestResults {
    // Extract annotations
    const annotations = test.annotations || [];
    const description = annotations.find(a => a.type === 'description')?.description || 'No Description';
    const preConditions = annotations.filter(a => a.type === 'precondition').map(a => a.description);
    const steps = annotations.filter(a => a.type === 'step').map(a => a.description);
    const postConditions = annotations.filter(a => a.type === 'postcondition').map(a => a.description);

    return {
      num: 0, // Will be set later
      title: test.title,
      fileName: test.location.file,
      timeDuration: result.duration,
      duration: this.formatDuration(result.duration),
      description: description,
      status: result.status,
      browser: test.parent.project()?.name || 'Unknown Browser',
      tags: test.tags || [],
      preConditions: preConditions.length > 0 ? preConditions : ['No pre conditions'],
      steps: steps.length > 0 ? steps : ['No steps'],
      postConditions: postConditions.length > 0 ? postConditions : ['No post conditions'],
      statusIcon: result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⏭️',
      videoPath: result.attachments.find(att => att.name === 'video')?.path,
      screenshotPaths: result.attachments
        .filter(att => att.name === 'screenshot')
        .map(att => att.path || ''),
      attachments: result.attachments
        .filter(att => !['screenshot', 'video', 'trace'].includes(att.name))
        .map(att => ({ name: att.name, path: att.path || '' })),
      errors: result.errors.map(error => error.message)
    };
  }

  private formatDuration(duration: number): string {
    const seconds = Math.floor(duration / 1000);
    const milliseconds = duration % 1000;
    
    if (seconds > 0) {
      return `${seconds}s ${milliseconds}ms`;
    } else {
      return `${milliseconds}ms`;
    }
  }

  private async injectCopyPromptFeature(): Promise<void> {
    const reportPath = path.join(this.config.folderPath || 'ortoni-report', this.config.filename || 'index.html');
    
    if (!fs.existsSync(reportPath)) {
      console.warn('Ortoni report not found, skipping Copy Prompt injection');
      return;
    }

    try {
      // Read the existing report
      let reportContent = fs.readFileSync(reportPath, 'utf8');
      
      // Extract the test data from the script tag
      const testDataMatch = reportContent.match(/<script[^>]*>[\s\S]*?window\.__ORTONI_DATA__\s*=\s*({[\s\S]*?});[\s\S]*?<\/script>/);
      if (!testDataMatch) {
        console.warn('Could not find Ortoni test data in report');
        return;
      }

      const originalData = JSON.parse(testDataMatch[1]);
      
      // Inject prompts into failed tests
      this.injectPromptsIntoTestData(originalData);
      
      // Create the Copy Prompt JavaScript
      const copyPromptScript = this.generateCopyPromptScript();
      
      // Inject the Copy Prompt script before the closing body tag
      const scriptInjection = `
    <!-- Copy Prompt Feature Injection -->
    <script>
      ${copyPromptScript}
    </script>
    <style>
      .copy-prompt-btn {
        background: rgba(255,255,255,0.2);
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        transition: all 0.2s ease;
        margin-left: 8px;
        margin-top: 4px;
      }
      .copy-prompt-btn:hover {
        background: rgba(255,255,255,0.3);
        border-color: rgba(255,255,255,0.5);
        transform: translateY(-1px);
      }
      .copy-prompt-btn:active {
        transform: translateY(0);
      }
      .copy-prompt-btn .material-symbols-outlined {
        font-size: 16px;
      }
      .copy-prompt-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: 'Roboto', sans-serif;
        font-size: 14px;
        font-weight: 500;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
      }
      .copy-prompt-notification.show {
        opacity: 1;
        transform: translateX(0);
      }
      .copy-prompt-notification.error {
        background: #f44336;
      }
    </style>
`;

      // Replace the test data with updated data
      const updatedData = JSON.stringify(originalData);
      reportContent = reportContent.replace(testDataMatch[0], `<script>window.__ORTONI_DATA__ = ${updatedData};</script>`);
      
      // Inject the Copy Prompt functionality
      reportContent = reportContent.replace('</body>', `${scriptInjection}</body>`);
      
      // Write the updated report
      fs.writeFileSync(reportPath, reportContent);
      
      console.log('✅ Copy Prompt feature successfully injected into Ortoni report');
    } catch (error) {
      console.error('❌ Failed to inject Copy Prompt feature into Ortoni report:', error);
    }
  }

  private injectPromptsIntoTestData(data: any): void {
    // Navigate through the test data structure and inject prompts
    if (data.testResult && data.testResult.tests) {
      for (const fileName in data.testResult.tests) {
        const fileTests = data.testResult.tests[fileName];
        for (const suiteName in fileTests) {
          const suiteTests = fileTests[suiteName];
          for (const browserName in suiteTests) {
            const browserTests = suiteTests[browserName];
            if (Array.isArray(browserTests)) {
              browserTests.forEach((test: any) => {
                if (test.status === 'failed') {
                  const testKey = `${fileName}:${browserName}:${test.title}`;
                  const storedData = this.testData.get(testKey);
                  if (storedData && storedData.prompts) {
                    test.prompts = storedData.prompts;
                  }
                }
              });
            }
          }
        }
      }
    }
  }

  private generateCopyPromptScript(): string {
    return `
      // Copy Prompt functionality for Ortoni reports
      (function() {
        // Wait for the React app to load
        function waitForReactApp() {
          const testElements = document.querySelectorAll('[data-testid*="test"], .test-item, [class*="test"]');
          if (testElements.length === 0) {
            setTimeout(waitForReactApp, 500);
            return;
          }
          
          // Add Copy Prompt buttons to failed tests
          addCopyPromptButtons();
          
          // Set up mutation observer to handle dynamic content
          const observer = new MutationObserver(() => {
            addCopyPromptButtons();
          });
          
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
        
        function addCopyPromptButtons() {
          // Find all test elements that represent failed tests
          const testElements = document.querySelectorAll('[data-testid*="test"], .test-item, [class*="test"]');
          
          testElements.forEach(testElement => {
            // Check if this is a failed test
            const statusElement = testElement.querySelector('[class*="status"], [class*="failed"], [data-testid*="status"]');
            const isFailed = statusElement && (
              statusElement.textContent?.includes('failed') ||
              statusElement.className?.includes('failed') ||
              statusElement.getAttribute('data-testid')?.includes('failed')
            );
            
            if (isFailed && !testElement.querySelector('.copy-prompt-btn')) {
              // Find the test title or identifier
              const titleElement = testElement.querySelector('[class*="title"], [class*="name"], h3, h4');
              if (titleElement) {
                // Extract test information
                const testTitle = titleElement.textContent?.trim() || 'Unknown Test';
                const testData = extractTestDataFromElement(testElement);
                
                if (testData) {
                  // Create Copy Prompt buttons
                  const buttonContainer = document.createElement('div');
                  buttonContainer.className = 'copy-prompt-buttons';
                  buttonContainer.style.cssText = 'margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;';
                  
                  const buttons = [
                    { type: 'full', label: 'Copy Full Prompt', icon: 'content_copy' },
                    { type: 'quick', label: 'Quick Analysis', icon: 'flash_on' },
                    { type: 'debug', label: 'Debug Help', icon: 'bug_report' }
                  ];
                  
                  buttons.forEach(button => {
                    const btn = document.createElement('button');
                    btn.className = 'copy-prompt-btn';
                    btn.innerHTML = \`<span class="material-symbols-outlined">\${button.icon}</span>\${button.label}\`;
                    btn.onclick = () => copyPrompt(button.type, testData);
                    buttonContainer.appendChild(btn);
                  });
                  
                  // Insert buttons after the title
                  titleElement.parentNode?.insertBefore(buttonContainer, titleElement.nextSibling);
                }
              }
            }
          });
        }
        
        function extractTestDataFromElement(element) {
          // Try to extract test data from the element or global data
          const testData = window.__ORTONI_DATA__;
          if (!testData || !testData.testResult) return null;
          
          // Find the test in the data structure
          for (const fileName in testData.testResult.tests) {
            const fileTests = testData.testResult.tests[fileName];
            for (const suiteName in fileTests) {
              const suiteTests = fileTests[suiteName];
              for (const browserName in suiteTests) {
                const browserTests = suiteTests[browserName];
                if (Array.isArray(browserTests)) {
                  const test = browserTests.find(t => t.status === 'failed');
                  if (test && test.prompts) {
                    return test;
                  }
                }
              }
            }
          }
          
          return null;
        }
        
        async function copyPrompt(type, testData) {
          const promptText = testData.prompts[type];
          if (!promptText) {
            showNotification('Prompt not available', 'error');
            return;
          }
          
          try {
            if (navigator.clipboard && window.isSecureContext) {
              await navigator.clipboard.writeText(promptText);
            } else {
              // Fallback for non-secure contexts
              const textArea = document.createElement('textarea');
              textArea.value = promptText;
              textArea.style.position = 'fixed';
              textArea.style.left = '-999999px';
              textArea.style.top = '-999999px';
              textArea.style.opacity = '0';
              document.body.appendChild(textArea);
              textArea.focus();
              textArea.select();
              
              const successful = document.execCommand('copy');
              document.body.removeChild(textArea);
              
              if (!successful) {
                throw new Error('execCommand copy failed');
              }
            }
            
            showNotification('Prompt copied to clipboard!', 'success');
          } catch (error) {
            console.error('Failed to copy prompt:', error);
            showNotification('Failed to copy prompt. Check console for details.', 'error');
          }
        }
        
        function showNotification(message, type = 'success') {
          // Remove existing notifications
          const existing = document.querySelector('.copy-prompt-notification');
          if (existing) {
            existing.remove();
          }
          
          const notification = document.createElement('div');
          notification.className = \`copy-prompt-notification \${type}\`;
          notification.textContent = message;
          document.body.appendChild(notification);
          
          // Show notification
          setTimeout(() => {
            notification.classList.add('show');
          }, 100);
          
          // Hide notification after 3 seconds
          setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
              if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
              }
            }, 300);
          }, 3000);
        }
        
        // Start the process
        waitForReactApp();
      })();
    `;
  }
}
