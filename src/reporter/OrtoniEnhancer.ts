import * as fs from 'fs';
import * as path from 'path';

export class OrtoniEnhancer {
  private ortoniReportPath: string;

  constructor(ortoniReportPath: string) {
    this.ortoniReportPath = ortoniReportPath;
  }

  async enhanceReport(): Promise<void> {
    try {
      const indexPath = path.join(this.ortoniReportPath, 'index.html');
      
      if (!fs.existsSync(indexPath)) {
        console.log('Ortoni report not found at:', indexPath);
        return;
      }

      // Read the existing Ortoni report
      let htmlContent = fs.readFileSync(indexPath, 'utf8');
      
      // Inject Copy Prompt functionality into the HTML
      const enhancedHtml = this.injectCopyPromptFunctionality(htmlContent);
      
      // Write the enhanced report
      fs.writeFileSync(indexPath, enhancedHtml);
      
      console.log('✅ Ortoni report enhanced with Copy Prompt functionality');
      
    } catch (error) {
      console.error('❌ Error enhancing Ortoni report:', error);
    }
  }

  private injectCopyPromptFunctionality(htmlContent: string): string {
    // Add Copy Prompt CSS
    const copyPromptStyles = `
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
          margin: 4px;
        }
        .copy-prompt-btn:hover {
          background: rgba(255,255,255,0.3);
          border-color: rgba(255,255,255,0.5);
        }
        .copy-prompt-btn.success {
          background: rgba(76, 175, 80, 0.8);
          border-color: rgba(76, 175, 80, 1);
        }
        .copy-prompt-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #333;
          color: white;
          padding: 12px 16px;
          border-radius: 6px;
          z-index: 10000;
          font-size: 0.9rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .copy-prompt-notification.success {
          background: #4caf50;
        }
        .copy-prompt-notification.error {
          background: #f44336;
        }
        .copy-prompt-actions {
          margin-top: 10px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
      </style>
    `;

    // Add Copy Prompt JavaScript
    const copyPromptScript = `
      <script>
        // Copy Prompt functionality
        async function copyPrompt(testData, type) {
          let promptText = '';
          
          if (type === 'full') {
            promptText = generateFullPrompt(testData);
          } else if (type === 'quick') {
            promptText = generateQuickPrompt(testData);
          } else if (type === 'debug') {
            promptText = generateDebugPrompt(testData);
          }
          
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

        function generateFullPrompt(testData) {
          let prompt = \`# Playwright Test Failure Analysis\\n\\n\`;
          prompt += \`**Test:** \${testData.title}\\n\`;
          prompt += \`**Status:** \${testData.status.toUpperCase()}\\n\`;
          prompt += \`**Browser:** \${testData.projectName}\\n\`;
          prompt += \`**Duration:** \${testData.duration}ms\\n\`;
          prompt += \`**Timestamp:** \${new Date().toISOString()}\\n\\n\`;
          
          if (testData.errors && testData.errors.length > 0) {
            prompt += \`## Error Details\\n\`;
            testData.errors.forEach((error, i) => {
              prompt += \`### Error \${i + 1}\\n\`;
              prompt += \`\\\`\\\`\\\`\\n\${error}\\n\\\`\\\`\\\`\\n\\n\`;
            });
          }
          
          prompt += \`## Test Location\\n\`;
          prompt += \`**File:** \${testData.filePath}\\n\\n\`;
          
          if (testData.tags && testData.tags.length > 0) {
            prompt += \`## Tags\\n\${testData.tags.map(tag => \`#\${tag}\`).join(' ')}\\n\\n\`;
          }
          
          prompt += \`## Available Attachments\\n\`;
          if (testData.screenshots && testData.screenshots.length > 0) {
            prompt += \`### Screenshots\\n\`;
            testData.screenshots.forEach((screenshot, i) => {
              prompt += \`\${i + 1}. \${screenshot}\\n\`;
            });
            prompt += \`\\n\`;
          }
          if (testData.videoPath && testData.videoPath.length > 0) {
            prompt += \`### Videos\\n\`;
            testData.videoPath.forEach((video, i) => {
              prompt += \`\${i + 1}. \${video}\\n\`;
            });
            prompt += \`\\n\`;
          }
          if (!testData.screenshots?.length && !testData.videoPath?.length) {
            prompt += \`No attachments available.\\n\\n\`;
          }
          
          prompt += \`## AI Analysis Request\\n\\n\`;
          prompt += \`Please analyze this test failure and provide:\\n\\n\`;
          prompt += \`1. **Root Cause Analysis:** What likely caused this test to fail?\\n\`;
          prompt += \`2. **Potential Fixes:** Specific steps to resolve the issue\\n\`;
          prompt += \`3. **Prevention Strategies:** How to prevent similar failures in the future\\n\`;
          prompt += \`4. **Code Suggestions:** If applicable, provide code examples or modifications\\n\`;
          prompt += \`5. **Additional Context:** Any other insights that might be helpful\\n\\n\`;
          prompt += \`Focus on actionable solutions and consider the test steps, error messages, and available attachments when providing your analysis.\`;
          
          return prompt;
        }

        function generateQuickPrompt(testData) {
          let prompt = \`# Quick Test Failure Analysis: \${testData.title}\\n\\n\`;
          prompt += \`**Status:** \${testData.status} | **Browser:** \${testData.projectName} | **Duration:** \${testData.duration}ms\\n\\n\`;
          
          if (testData.errors && testData.errors.length > 0) {
            prompt += \`## Error\\n\`;
            prompt += \`\\\`\\\`\\\`\\n\${testData.errors[0]}\\n\\\`\\\`\\\`\\n\\n\`;
          }
          
          prompt += \`## Request\\nPlease provide a quick analysis of this test failure and suggest the most likely fix.\`;
          return prompt;
        }

        function generateDebugPrompt(testData) {
          let prompt = \`# Debugging Assistance: \${testData.title}\\n\\n\`;
          prompt += \`**Test:** \${testData.title}\\n\`;
          prompt += \`**Browser:** \${testData.projectName}\\n\`;
          prompt += \`**File:** \${testData.filePath}\\n\\n\`;
          
          if (testData.errors && testData.errors.length > 0) {
            prompt += \`## Error Details\\n\`;
            prompt += \`\\\`\\\`\\\`\\n\${testData.errors[0]}\\n\\\`\\\`\\\`\\n\\n\`;
          }
          
          prompt += \`## Debugging Request\\nHelp me debug this test failure. Focus on:\\n\`;
          prompt += \`- What went wrong and why\\n\`;
          prompt += \`- How to reproduce the issue\\n\`;
          prompt += \`- Specific debugging steps to take\\n\`;
          prompt += \`- What to look for in the screenshots/videos/traces\`;
          return prompt;
        }

        function showNotification(message, type = 'success') {
          const notification = document.createElement('div');
          notification.className = \`copy-prompt-notification \${type}\`;
          notification.textContent = message;
          document.body.appendChild(notification);
          
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 3000);
        }

        // Add Copy Prompt buttons to failed tests
        function addCopyPromptButtons() {
          // Create a floating Copy Prompt panel
          const createFloatingPanel = () => {
            // Remove existing panel if it exists
            const existingPanel = document.getElementById('copy-prompt-panel');
            if (existingPanel) {
              existingPanel.remove();
            }
            
            // Create floating panel
            const panel = document.createElement('div');
            panel.id = 'copy-prompt-panel';
            panel.style.cssText = \`
              position: fixed;
              top: 20px;
              right: 20px;
              background: rgba(0, 0, 0, 0.9);
              color: white;
              padding: 15px;
              border-radius: 8px;
              z-index: 10000;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              font-family: Arial, sans-serif;
              min-width: 250px;
            \`;
            
            // Add title
            const title = document.createElement('div');
            title.textContent = '🤖 AI Copy Prompt';
            title.style.cssText = 'font-weight: bold; margin-bottom: 10px; font-size: 14px;';
            panel.appendChild(title);
            
            // Add description
            const desc = document.createElement('div');
            desc.textContent = 'Click any button to copy a prompt for AI analysis:';
            desc.style.cssText = 'font-size: 12px; margin-bottom: 10px; color: #ccc;';
            panel.appendChild(desc);
            
            // Create buttons container
            const buttonsContainer = document.createElement('div');
            buttonsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';
            
            // Create buttons
            const fullBtn = document.createElement('button');
            fullBtn.className = 'copy-prompt-btn';
            fullBtn.innerHTML = '📋 Copy Full Prompt';
            fullBtn.onclick = () => {
              const testData = extractCurrentTestData();
              copyPrompt(testData, 'full');
            };
            
            const quickBtn = document.createElement('button');
            quickBtn.className = 'copy-prompt-btn';
            quickBtn.innerHTML = '⚡ Quick Analysis';
            quickBtn.onclick = () => {
              const testData = extractCurrentTestData();
              copyPrompt(testData, 'quick');
            };
            
            const debugBtn = document.createElement('button');
            debugBtn.className = 'copy-prompt-btn';
            debugBtn.innerHTML = '🐛 Debug Help';
            debugBtn.onclick = () => {
              const testData = extractCurrentTestData();
              copyPrompt(testData, 'debug');
            };
            
            buttonsContainer.appendChild(fullBtn);
            buttonsContainer.appendChild(quickBtn);
            buttonsContainer.appendChild(debugBtn);
            panel.appendChild(buttonsContainer);
            
            // Add close button
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            closeBtn.style.cssText = \`
              position: absolute;
              top: 5px;
              right: 8px;
              background: none;
              border: none;
              color: white;
              cursor: pointer;
              font-size: 16px;
            \`;
            closeBtn.onclick = () => panel.remove();
            panel.appendChild(closeBtn);
            
            // Add to page
            document.body.appendChild(panel);
          };
          
          // Wait for page to load
          setTimeout(() => {
            createFloatingPanel();
          }, 1000);
        }

        function extractCurrentTestData() {
          // Extract test data from the currently visible test in Ortoni
          const testTitle = document.querySelector('h1, h2, h3, [class*="title"], [class*="name"]')?.textContent || 'Unknown Test';
          const testStatus = 'failed'; // We're only showing this for failed tests
          const projectName = document.querySelector('[class*="project"], [class*="browser"]')?.textContent || 'unknown';
          const duration = document.querySelector('[class*="duration"], [class*="time"]')?.textContent || '0ms';
          const filePath = document.querySelector('[class*="file"], [class*="path"]')?.textContent || 'unknown';
          
          // Try to extract error information
          const errorElements = document.querySelectorAll('[class*="error"], [class*="fail"], pre, code');
          const errors = Array.from(errorElements).map(el => el.textContent).filter(text => text && text.length > 10);
          
          // Try to extract step information
          const stepElements = document.querySelectorAll('[class*="step"], [class*="action"], li');
          const steps = Array.from(stepElements).map(el => el.textContent).filter(text => text && text.length > 5);
          
          return {
            title: testTitle,
            status: testStatus,
            projectName: projectName,
            duration: parseInt(duration.replace(/[^0-9]/g, '')) || 0,
            filePath: filePath,
            errors: errors.slice(0, 3), // Limit to first 3 errors
            steps: steps.slice(0, 5), // Limit to first 5 steps
            screenshots: [],
            videoPath: [],
            tags: []
          };
        }

        // Initialize when page loads
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', addCopyPromptButtons);
        } else {
          addCopyPromptButtons();
        }
      </script>
    `;

    // Inject the styles and script
    const enhancedHtml = htmlContent
      .replace('</head>', `${copyPromptStyles}</head>`)
      .replace('</body>', `${copyPromptScript}</body>`);

    return enhancedHtml;
  }
}