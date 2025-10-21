# Ortoni Reporter Setup

## Overview
Ortoni Reporter provides fast, comprehensive test reporting with beautiful charts and visual analytics. This guide covers setup, configuration, and the AI-Powered Copy Prompt enhancement.

## Installation
Ortoni Reporter is already included in this project:
```bash
npm install ortoni-report
```

## Configuration
Configure Ortoni in `playwright.config.ts`:
```typescript
const reportConfig: OrtoniReportConfig = {
  folderPath: 'ortoni-report',
  autoOpen: true,
  port: 2004
};
```

## Usage

### Basic Usage
```bash
# Run tests with Ortoni reporting
npm run test:ortoni

# View report manually
npm run show-ortoni-report
```

### AI-Powered Copy Prompt Enhancement
The Ortoni reporter is enhanced with Copy Prompt functionality:

```bash
# Automatic enhancement (included in test:ortoni)
npm run test:ortoni

# Manual enhancement of existing reports
npm run enhance-ortoni
```

## Features

### Core Features
- ⚡ Fast report generation
- 📊 Beautiful charts and analytics
- 📈 Test history with SQLite database
- 🔄 Auto-open reports
- 📱 Responsive design

### AI-Powered Copy Prompt Feature
- **📋 Copy Full Prompt**: Comprehensive analysis with all test details
- **⚡ Quick Analysis**: Fast debugging with essential error information
- **🐛 Debug Help**: Step-by-step debugging guidance

## Report Structure
```
ortoni-report/
├── index.html                    # Main report file
├── ortoni-data/                  # Report data directory
│   └── attachments/             # Test attachments
├── ortoni-data-history.sqlite   # Test history database
└── trace/                       # Trace files
```

## Troubleshooting

### Copy Prompt Buttons Not Visible
If Copy Prompt buttons don't appear:
1. Ensure the enhancement script ran: `npm run enhance-ortoni`
2. Check browser console for JavaScript errors
3. Verify the report contains failed tests
4. Try refreshing the page

### Report Not Opening
- Check if port 2004 is available
- Try manual opening: `npm run show-ortoni-report`
- Verify report exists: `ls ortoni-report/`

### Performance Issues
- Large reports may take time to load
- Consider using filters to reduce data
- Check browser memory usage

## Integration with CI/CD
Ortoni reports work seamlessly in CI environments:
```yaml
- name: Upload Ortoni Report
  uses: actions/upload-artifact@v3
  with:
    name: ortoni-report
    path: ortoni-report/
```

## Best Practices
- Use Ortoni for development and quick feedback
- Combine with other reporters for comprehensive coverage
- Regularly clean old reports to save disk space
- Use the Copy Prompt feature for debugging failed tests