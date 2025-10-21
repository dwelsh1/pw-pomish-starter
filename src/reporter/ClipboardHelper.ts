/**
 * Clipboard utility for copying prompts to the user's clipboard
 */
export class ClipboardHelper {
  /**
   * Copies text to the clipboard using the Clipboard API
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for non-secure contexts or older browsers
        return this.fallbackCopyToClipboard(text);
      }
    } catch (error) {
      console.warn('Failed to copy to clipboard:', error);
      return this.fallbackCopyToClipboard(text);
    }
  }

  /**
   * Fallback method for copying to clipboard using execCommand
   */
  private static fallbackCopyToClipboard(text: string): boolean {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    } catch (error) {
      console.warn('Fallback copy to clipboard failed:', error);
      return false;
    }
  }

  /**
   * Shows a temporary notification that text was copied
   */
  static showCopyNotification(element: HTMLElement, message: string = 'Copied to clipboard!'): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  /**
   * Creates a copy button element with click handler
   */
  static createCopyButton(
    textToCopy: string,
    buttonText: string = 'Copy Prompt',
    className: string = 'copy-prompt-btn'
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = buttonText;
    button.className = className;
    button.style.cssText = `
      background: #007acc;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      transition: background-color 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    `;

    // Add hover effect
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = '#005a9e';
    });

    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = '#007acc';
    });

    // Add click handler
    button.addEventListener('click', async () => {
      const success = await this.copyToClipboard(textToCopy);
      if (success) {
        this.showCopyNotification(button, 'Prompt copied to clipboard!');
        // Temporarily change button text
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = '#007acc';
        }, 2000);
      } else {
        this.showCopyNotification(button, 'Failed to copy. Please try again.');
      }
    });

    return button;
  }

  /**
   * Adds copy functionality to an existing element
   */
  static addCopyFunctionality(
    element: HTMLElement,
    textToCopy: string,
    copyButtonText: string = 'Copy'
  ): void {
    const copyButton = this.createCopyButton(textToCopy, copyButtonText, 'copy-btn');
    
    // Style the container
    element.style.position = 'relative';
    
    // Add the copy button
    element.appendChild(copyButton);
    
    // Position the button (can be customized based on layout)
    copyButton.style.position = 'absolute';
    copyButton.style.top = '10px';
    copyButton.style.right = '10px';
  }
}
