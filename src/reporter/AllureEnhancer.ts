import * as fs from 'fs';
import * as path from 'path';
import { PromptGenerator } from './PromptGenerator';
import { TestResults } from './types';

export class AllureEnhancer {
  private promptGenerator: PromptGenerator;

  constructor() {
    this.promptGenerator = new PromptGenerator();
  }

  public enhanceReport(reportPath: string): void {
    try {
      console.log('🚀 Enhancing Allure report with Copy Prompt functionality...');
      
      // Read the main HTML file
      let htmlContent = fs.readFileSync(reportPath, 'utf-8');

      // Inject CSS for the buttons and notifications
      htmlContent = htmlContent.replace(
        '</head>',
        `
        <style>
          .copy-prompt-actions {
            margin-top: 15px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            padding: 10px;
            background: rgba(0, 0, 0, 0.05);
            border-radius: 6px;
            border-left: 4px solid #ff6b6b;
          }
          .copy-prompt-btn {
            background: #4a4a4a;
            color: white;
            border: 1px solid #666;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: all 0.2s ease;
            font-family: 'Roboto', sans-serif;
          }
          .copy-prompt-btn:hover {
            background: #5a5a5a;
            border-color: #888;
          }
          .copy-prompt-btn:active {
            background: #3a3a3a;
          }
          .copy-prompt-btn.success {
            background: #4CAF50;
            border-color: #4CAF50;
          }
          .copy-prompt-btn.error {
            background: #f44336;
            border-color: #f44336;
          }
          .copy-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
          }
          .copy-notification.show {
            opacity: 1;
          }
          .copy-notification.success {
            background-color: #4CAF50;
          }
          .copy-notification.error {
            background-color: #f44336;
          }
        </style>
        </head>`
      );

      // Inject JavaScript for clipboard functionality and button injection
      htmlContent = htmlContent.replace(
        '</body>',
        `
        <script>
          function showNotification(message, type = 'success') {
            let notification = document.getElementById('copy-notification');
            if (!notification) {
              notification = document.createElement('div');
              notification.id = 'copy-notification';
              notification.className = 'copy-notification';
              document.body.appendChild(notification);
            }
            notification.textContent = message;
            notification.className = \`copy-notification show \${type}\`;
            setTimeout(() => {
              notification.classList.remove('show');
            }, 3000);
          }

          async function copyPrompt(testData, type) {
            let promptText = '';
            if (testData && testData.prompts) {
              promptText = testData.prompts[type];
            }

            if (!promptText) {
              showNotification('Prompt not available', 'error');
              return;
            }

            try {
              if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(promptText);
              } else {
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

              // Update button appearance
              const button = event.target;
              if (button) {
                const originalText = button.innerHTML;
                button.innerHTML = '<span class="material-symbols-outlined">check</span>Copied!';
                button.style.background = 'rgba(76, 175, 80, 0.8)';

                setTimeout(() => {
                  button.innerHTML = originalText;
                  button.style.background = '#4a4a4a';
                }, 2000);
              }
            } catch (error) {
              console.error('Failed to copy prompt:', error);
              showNotification('Failed to copy prompt. Check console for details.', 'error');
            }
          }

          // Add Copy Prompt buttons to failed tests
          function addCopyPromptButtons() {
            // Wait for Allure to load and render
            setTimeout(() => {
              const checkForTests = () => {
                // Look for Allure's test result elements - try multiple selectors
                const testElements = document.querySelectorAll('.testcase, .test-case, [data-test-id], .test-item, .testcase__body, .testcase__content, .testcase__overview');
                
                // Also check for the main content area where test details are shown
                const mainContent = document.querySelector('#content, .content, .testcase__body, .testcase__overview');
                
                if (mainContent && !mainContent.querySelector('.copy-prompt-actions')) {
                  // Check if we're viewing a failed test by looking for failure indicators
                  const isFailed = mainContent.textContent?.includes('Failed') || 
                                  mainContent.textContent?.includes('failed') ||
                                  mainContent.querySelector('.status-failed, .failed, [class*="fail"]') ||
                                  mainContent.querySelector('.testcase__status-failed') ||
                                  document.querySelector('.testcase__status-failed');

                  if (isFailed) {
                    // Create copy prompt buttons container
                    const actionsContainer = document.createElement('div');
                    actionsContainer.className = 'copy-prompt-actions';
                    actionsContainer.style.cssText = 'margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap; padding: 10px; background: rgba(0, 0, 0, 0.05); border-radius: 6px; border-left: 4px solid #ff6b6b;';

                    // Create buttons
                    const fullBtn = document.createElement('button');
                    fullBtn.className = 'copy-prompt-btn';
                    fullBtn.innerHTML = '📋 Copy Full Prompt';
                    fullBtn.onclick = () => {
                      const testData = extractTestDataFromElement(mainContent);
                      copyPrompt(testData, 'full');
                    };

                    const quickBtn = document.createElement('button');
                    quickBtn.className = 'copy-prompt-btn';
                    quickBtn.innerHTML = '⚡ Quick Analysis';
                    quickBtn.onclick = () => {
                      const testData = extractTestDataFromElement(mainContent);
                      copyPrompt(testData, 'quick');
                    };

                    const debugBtn = document.createElement('button');
                    debugBtn.className = 'copy-prompt-btn';
                    debugBtn.innerHTML = '🐛 Debug Help';
                    debugBtn.onclick = () => {
                      const testData = extractTestDataFromElement(mainContent);
                      copyPrompt(testData, 'debug');
                    };

                    actionsContainer.appendChild(fullBtn);
                    actionsContainer.appendChild(quickBtn);
                    actionsContainer.appendChild(debugBtn);

                    // Add to main content area
                    mainContent.appendChild(actionsContainer);
                  }
                }
              };

              // Check immediately and then periodically
              checkForTests();
              setInterval(checkForTests, 2000);
            }, 2000);
          }

          function extractTestDataFromElement(element) {
            // Extract test data from the DOM element - try multiple selectors for Allure
            const title = element.querySelector('.testcase__name, .test-name, h1, h2, h3, h4, .test-title, .testcase__title')?.textContent || 
                         document.querySelector('.testcase__name, .test-name, h1, h2, h3, h4, .test-title, .testcase__title')?.textContent || 
                         'Unknown Test';
            
            const status = 'failed'; // We're only showing this for failed tests
            
            const browser = element.querySelector('.testcase__project, .project-name, .browser-name, .testcase__parameter')?.textContent || 
                           document.querySelector('.testcase__project, .project-name, .browser-name, .testcase__parameter')?.textContent || 
                           'unknown';
            
            const duration = element.querySelector('.testcase__duration, .duration, .test-duration, .testcase__time')?.textContent || 
                           document.querySelector('.testcase__duration, .duration, .test-duration, .testcase__time')?.textContent || 
                           '0ms';
            
            const fileName = element.querySelector('.testcase__file, .file-path, .test-file, .testcase__path')?.textContent || 
                            document.querySelector('.testcase__file, .file-path, .test-file, .testcase__path')?.textContent || 
                            'unknown';
            
            // Try to extract error information from multiple possible locations
            const errorElements = element.querySelectorAll('.testcase__error, .error-message, .test-error, .status-message, .testcase__status-message, .testcase__failure');
            const documentErrorElements = document.querySelectorAll('.testcase__error, .error-message, .test-error, .status-message, .testcase__status-message, .testcase__failure');
            const allErrorElements = [...errorElements, ...documentErrorElements];
            const errors = Array.from(allErrorElements).map(el => el.textContent).filter(text => text && text.length > 10);
            
            // Try to extract step information
            const stepElements = element.querySelectorAll('.testcase__step, .step-item, .test-step, .testcase__step-item');
            const documentStepElements = document.querySelectorAll('.testcase__step, .step-item, .test-step, .testcase__step-item');
            const allStepElements = [...stepElements, ...documentStepElements];
            const steps = Array.from(allStepElements).map(el => el.textContent).filter(text => text && text.length > 5);
            
            // Try to extract attachment information
            const attachmentElements = element.querySelectorAll('.testcase__attachment, .attachment-item, .test-attachment, .testcase__attachment-item');
            const documentAttachmentElements = document.querySelectorAll('.testcase__attachment, .attachment-item, .test-attachment, .testcase__attachment-item');
            const allAttachmentElements = [...attachmentElements, ...documentAttachmentElements];
            const attachments = Array.from(allAttachmentElements).map(el => ({
              name: el.textContent || '',
              path: el.href || ''
            }));

            const mockTestResult = {
              num: 0,
              title,
              fileName,
              timeDuration: parseInt(duration.replace(/[^0-9]/g, '')) || 0,
              duration,
              description: 'No Description',
              status,
              statusIcon: '❌',
              browser,
              tags: [],
              preConditions: [],
              steps: steps.slice(0, 5), // Limit to first 5 steps
              postConditions: [],
              errors: errors.slice(0, 3), // Limit to first 3 errors
              screenshotPaths: attachments.filter(a => a.name.includes('screenshot') || a.name.includes('.png')).map(a => a.path),
              videoPath: attachments.find(a => a.name.includes('video') || a.name.includes('.webm'))?.path || '',
              attachments: attachments,
            };

            // Generate prompts using the PromptGenerator
            return {
              ...mockTestResult,
              prompts: {
                full: ${this.promptGenerator.generatePrompt.toString()}(mockTestResult),
                quick: ${this.promptGenerator.generateQuickPrompt.toString()}(mockTestResult),
                debug: ${this.promptGenerator.generateDebugPrompt.toString()}(mockTestResult),
              }
            };
          }

          // Initialize when page loads
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addCopyPromptButtons);
          } else {
            addCopyPromptButtons();
          }
        </script>
        </body>`
      );

      fs.writeFileSync(reportPath, htmlContent, 'utf-8');
      console.log('✅ Allure report enhanced with Copy Prompt functionality');
    } catch (error) {
      console.error('❌ Error enhancing Allure report:', error);
    }
  }
}
