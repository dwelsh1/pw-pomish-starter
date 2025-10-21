# Copy Prompt Feature Usage Guide

## Overview

The Copy Prompt feature provides AI-friendly prompts for failed Playwright tests, making it easy to get debugging assistance from AI tools like Cursor, ChatGPT, or Claude. When a test fails, you'll see three Copy Prompt buttons that generate different types of prompts tailored for specific use cases.

## Available Copy Prompt Types

### 1. **Copy Full Prompt** 📋
**Best for:** Comprehensive analysis and detailed debugging

**What's Included:**
- **Test Details:** Title, status, browser, duration, timestamp
- **Test Description:** Full test description and context
- **Pre-conditions:** Setup steps before the test
- **Test Steps:** Detailed step-by-step execution
- **Post-conditions:** Cleanup steps after the test
- **Error Details:** Complete error messages with stack traces
- **Test Location:** File path and line numbers
- **Tags:** Test categorization tags
- **Attachment References:** Screenshots, videos, traces, and other files
- **AI Analysis Request:** Structured request for comprehensive analysis

**Use When:**
- You need a complete understanding of the test failure
- You want detailed debugging assistance
- You need to understand the full test context
- You're working on complex test failures

### 2. **Quick Analysis** ⚡
**Best for:** Fast debugging and quick fixes

**What's Included:**
- **Test Details:** Title, status, browser, duration
- **Primary Error:** The main error message
- **Quick Request:** Concise request for immediate fix suggestions

**Use When:**
- You need a quick solution
- You're familiar with the test and just need error analysis
- You want immediate fix suggestions
- You're debugging simple issues

### 3. **Debug Help** 🐛
**Best for:** Focused debugging assistance

**What's Included:**
- **Test Details:** Title, browser, file location
- **Error Details:** Main error message
- **Debugging Request:** Specific focus on debugging steps

**Use When:**
- You need step-by-step debugging guidance
- You want to understand how to reproduce the issue
- You need specific debugging techniques
- You're looking for debugging best practices

## What's Included in the Prompts

### ✅ **Always Included:**
- **Test Information:** Title, status, browser, duration, timestamp
- **Error Details:** Complete error messages with locator information
- **Test Location:** File path and line numbers
- **Attachment References:** Screenshots, videos, traces, error context files

### 📋 **Full Prompt Additional Content:**
- **Test Description:** Complete test context and purpose
- **Pre-conditions:** Setup steps and prerequisites
- **Test Steps:** Detailed execution steps
- **Post-conditions:** Cleanup and verification steps
- **Tags:** Test categorization and metadata
- **Comprehensive AI Request:** Structured analysis request

### ⚡ **Quick Analysis Additional Content:**
- **Primary Error Focus:** Main error message only
- **Quick Fix Request:** Immediate solution suggestions

### 🐛 **Debug Help Additional Content:**
- **Debugging Focus:** Step-by-step debugging guidance
- **Reproduction Steps:** How to reproduce the issue
- **Debugging Techniques:** Specific debugging approaches

## How to Use the Prompts

### 1. **Copy the Prompt**
- Click any of the three Copy Prompt buttons on a failed test
- The prompt will be copied to your clipboard
- You'll see a confirmation message

### 2. **Paste into AI Tools**
- **Cursor:** Paste into the chat or use Ctrl+K for inline assistance
- **ChatGPT:** Paste into the chat interface
- **Claude:** Paste into the conversation
- **Other AI Tools:** Use the standard paste command

### 3. **Reference Attachments**
When using the prompt, you can reference the mentioned attachments:
- **Screenshots:** "Check the screenshot `test-failed-1.png` for visual context"
- **Videos:** "Review the video `video.webm` to see the failure in action"
- **Traces:** "Examine the trace file `trace.zip` for detailed execution steps"
- **Error Context:** "The error context file `error-context.md` might have additional details"

## Best Practices

### 🎯 **Choose the Right Prompt Type:**
- **Full Prompt:** For complex failures or when you need complete context
- **Quick Analysis:** For simple fixes or when you're familiar with the test
- **Debug Help:** When you need debugging guidance or reproduction steps

### 📝 **Enhance Your AI Requests:**
- Add specific questions: "What's the most likely cause of this failure?"
- Request code examples: "Can you provide a fix for this locator issue?"
- Ask for prevention strategies: "How can I prevent similar failures?"

### 🔍 **Use Attachment References:**
- Mention specific attachments when asking questions
- Ask AI to analyze visual elements from screenshots
- Request trace analysis for complex failures

## Example Usage Scenarios

### Scenario 1: Complex Test Failure
**Use:** Copy Full Prompt
**Situation:** A test fails with multiple errors and you need comprehensive analysis
**AI Request:** "Analyze this test failure and provide a complete solution with code examples"

### Scenario 2: Quick Fix Needed
**Use:** Quick Analysis
**Situation:** A simple locator issue that needs immediate attention
**AI Request:** "What's the quickest way to fix this locator problem?"

### Scenario 3: Debugging Guidance
**Use:** Debug Help
**Situation:** You need to understand how to debug a specific issue
**AI Request:** "Help me debug this step by step and show me how to reproduce it"

## Troubleshooting

### ❌ **Copy Button Not Visible:**
- **Cause:** Copy Prompt buttons only appear on **failed tests**
- **Solution:** Navigate to a failed test to see the buttons

### ❌ **Copy Failed:**
- **Cause:** Browser security restrictions or clipboard API issues
- **Solution:** Try refreshing the page or using a different browser

### ❌ **Prompt Not Complete:**
- **Cause:** Test data might be incomplete
- **Solution:** Check that the test has proper annotations and error information

## Technical Details

### **Prompt Generation:**
- Prompts are generated by the `PromptGenerator` class
- Data is extracted from Playwright test results and annotations
- Prompts are structured for optimal AI consumption

### **Clipboard Integration:**
- Uses modern Clipboard API when available
- Falls back to `document.execCommand('copy')` for older browsers
- Handles secure context requirements

### **Attachment Handling:**
- References attachment files without including content
- Keeps prompts lightweight and focused
- Allows AI to reference specific files when needed

## Integration with AI Tools

### **Cursor Integration:**
- Paste prompts directly into chat
- Use Ctrl+K for inline assistance
- Reference attachments in follow-up questions

### **ChatGPT Integration:**
- Paste prompts into new conversations
- Use for debugging assistance
- Reference attachments for visual analysis

### **Claude Integration:**
- Paste prompts into conversations
- Use for comprehensive analysis
- Reference attachments for detailed debugging

## Future Enhancements

- **Custom Prompt Templates:** User-defined prompt formats
- **Attachment Content:** Optional inclusion of attachment content
- **Multi-language Support:** Prompts in different languages
- **Integration APIs:** Direct integration with AI tools
- **Prompt History:** Save and reuse successful prompts

---

**Note:** The Copy Prompt feature is currently available in the Custom Steps Reporter. Integration with other reporters (Ortoni, Allure) is planned for future releases.
