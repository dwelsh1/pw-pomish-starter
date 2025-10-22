# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.3] - 2025-01-21

### Added
- **Specs Reporter Sidebar Navigation**: Added sidebar with Dashboard and Tests navigation
- **In-Page Test Details**: Test details now load within the main content area instead of separate pages
- **Enhanced Copy Prompt Integration**: Global prompt data storage for seamless Copy Prompt functionality
- **Responsive Sidebar Design**: Mobile-friendly sidebar with collapsible navigation
- **URL Hash Navigation**: Browser back/forward support with hash-based routing
- **Dynamic Content Loading**: JavaScript-based content switching between Dashboard and Tests views
- **Improved Test Detail Display**: Enhanced formatting and media path correction for test details
- **Passing Test Support**: Proper display for passing tests with minimal content

### Changed
- **Specs Reporter Architecture**: Restructured from multi-page to single-page application
- **Test Detail Navigation**: Eliminated "Back to Summary" buttons and separate test pages
- **Copy Prompt Data Storage**: Moved from individual test files to global JavaScript object
- **Enhanced Button Removal**: Improved regex patterns for removing unwanted navigation elements
- **Media Path Correction**: Automatic path fixing for screenshots and videos in test details

### Fixed
- **Arrow Button Removal**: Completely removed stray navigation buttons from test details
- **Copy Prompt Functionality**: Fixed prompt data access for test detail views
- **Multiline Content Processing**: Enhanced regex patterns for multiline HTML content removal
- **Passing Test Display**: Added proper display for passing tests with minimal content

### Technical Details
- **File**: `src/reporter/templates/summary.html` - Enhanced with sidebar navigation and global prompt storage
- **JavaScript**: Added `window.testPrompts` global object for prompt data access
- **CSS**: Responsive sidebar design with mobile support
- **Navigation**: Hash-based routing with `showSection()` and `showTestDetail()` functions

## [0.3.2] - 2025-01-21

### Added
- **Allure Reporter Copy Prompt Integration**: Enhanced Allure reports with AI-powered Copy Prompt functionality
- **Post-Processing Enhancement**: `AllureEnhancer` class for adding Copy Prompt buttons to existing Allure reports
- **Automatic Enhancement**: `npm run test:allure` now automatically enhances reports with Copy Prompt functionality
- **Manual Enhancement**: `npm run enhance-allure` script for enhancing existing Allure reports
- **DOM-Based Integration**: Smart detection of failed tests and automatic button injection
- **Three Copy Prompt Types**: Full Prompt, Quick Analysis, and Debug Help buttons for failed tests
- **Enhanced Documentation**: Updated `docs/DEVELOPER.md` with Allure Copy Prompt feature details
- **Allure Setup Guide**: Created `docs/ALLURE_SETUP.md` with comprehensive setup instructions

### Changed
- **Package Scripts**: Updated `test:allure` to include automatic report enhancement
- **Documentation**: Updated integration status to include Allure Reporter

### Technical Details
- **File**: `src/reporter/AllureEnhancer.ts` - Post-processing enhancement class
- **Scripts**: `scripts/enhance-allure.ts` - Enhancement script runner
- **Integration**: DOM-based detection and button injection for failed tests
- **Compatibility**: Works with existing Allure reports without modification

## [0.3.1] - 2025-01-21

### Added
- **Ortoni Reporter Copy Prompt Integration**: Enhanced Ortoni reports with AI-powered Copy Prompt functionality
- **Post-Processing Enhancement**: `OrtoniEnhancer` class for adding Copy Prompt buttons to existing Ortoni reports
- **Automatic Enhancement**: `npm run test:ortoni` now automatically enhances reports with Copy Prompt functionality
- **Manual Enhancement**: `npm run enhance-ortoni` script for enhancing existing Ortoni reports
- **DOM-Based Integration**: Smart detection of failed tests and automatic button injection
- **Three Copy Prompt Types**: Full Prompt, Quick Analysis, and Debug Help buttons for failed tests
- **Enhanced Documentation**: Updated `docs/DEVELOPER.md` with Ortoni Copy Prompt feature details

### Changed
- **Package Scripts**: Updated `test:ortoni` to include automatic report enhancement
- **Dependencies**: Added `ts-node` for running TypeScript enhancement scripts

### Technical Details
- **File**: `src/reporter/OrtoniEnhancer.ts` - Post-processing enhancement class
- **Scripts**: `scripts/enhance-ortoni.ts` - Enhancement script runner
- **Integration**: DOM-based detection and button injection for failed tests
- **Compatibility**: Works with existing Ortoni reports without modification

## [0.3.0] - 2025-01-21

### Added
- **AI-Powered Copy Prompt Feature**: Revolutionary debugging assistance for failed tests
- **Three Prompt Types**: 
  - **Full Prompt** - Comprehensive analysis with complete test context
  - **Quick Analysis** - Fast debugging with essential error information
  - **Debug Help** - Step-by-step debugging guidance
- **Smart Prompt Generation**: 
  - Context-aware prompts including test description, steps, and preconditions
  - Error-focused content with complete error messages and stack traces
  - Attachment references (screenshots, videos, traces) without including binary content
  - AI-optimized structured format for optimal consumption
- **Robust Clipboard Integration**:
  - Modern Clipboard API support with fallback to `document.execCommand`
  - Secure context handling for both secure and non-secure environments
  - Visual feedback with button state changes and notifications
  - Graceful error handling and user-friendly error messages
- **PromptGenerator Class**: `src/reporter/PromptGenerator.ts` for generating AI-friendly prompts
- **Enhanced StepReporter**: Integration with prompt generation for failed tests
- **HTML Template Integration**: Copy Prompt buttons in `src/reporter/templates/stepReporter.html`
- **Type Definitions**: Enhanced `TestResults` interface with prompts property
- **Comprehensive Documentation**: 
  - `docs/COPY_PROMPT_USAGE.md` - Detailed usage guide for Copy Prompt feature
  - `docs/UNIT_TESTING.md` - Unit testing setup and guidelines
  - Updated `docs/DEVELOPER.md` with implementation details
- **Unit Testing Framework**: 
  - Jest and `ts-jest` configuration for TypeScript testing
  - Comprehensive test suite for StepReporter and helper functions
  - Mock data and fixtures for isolated testing
  - Test coverage for error handling and edge cases

### Changed
- **README.md**: Added AI-powered Copy Prompt feature to project highlights
- **Documentation Structure**: Enhanced cross-referencing between documentation files
- **StepReporter**: Enhanced with prompt generation capabilities for failed tests
- **TestResults Interface**: Added optional `prompts` property for AI prompt storage
- **HTML Templates**: Enhanced with Copy Prompt buttons and clipboard functionality
- **Package.json**: Added Jest and `@types/jest` as dev dependencies
- **TypeScript Configuration**: Added Jest types to `tsconfig.json`

### Fixed
- **Helper Function Bugs**: Fixed negative duration handling in `TimeHelper`
- **ANSI Conversion**: Added null/undefined input handling in `HtmlHelper`
- **Template Rendering**: Improved error handling and data binding
- **File Operations**: Enhanced error handling for file copying operations
- **Jest Configuration**: Resolved TypeScript integration issues and mocking problems

### Technical Details
- **Prompt Generation**: Extracts test metadata from Playwright `TestResult` and `TestCase` objects
- **Performance**: Minimal overhead - prompts generated only for failed tests
- **Browser Compatibility**: Works across modern and older browsers with fallback support
- **Cross-Platform**: Compatible with Windows, macOS, and Linux
- **Integration**: Currently available in Custom Specs Reporter, with plans for other reporters

## [0.2.0] - 2025-01-27

### Added
- **Visual Failure Demonstration**: Comprehensive comparison between Playwright and Applitools visual testing
- **Visual Failure Test Files**: 
  - `tests/visual/visual-failure-demo.spec.ts` - Playwright visual failure demonstration
  - `tests/visual/applitools/applitools-failure-demo.spec.ts` - Applitools visual failure demonstration
- **Enhanced Documentation**: Updated all `.md` files with visual failure demo commands and instructions
- **Visual Testing Comparison Guide**: `docs/VISUAL_FAILURE_DEMO.md` with detailed analysis of both approaches
- **Quick Start Commands**: Added visual failure demo commands to README and documentation
- **Cross-Platform Visual Testing**: Demonstrates pixel-perfect vs AI-powered visual comparison

### Changed
- **README.md**: Added visual failure demonstration commands to Quick Start section
- **docs/RUNNING_TESTS.md**: Enhanced Visual Tests section with failure demo commands
- **docs/APPLITOOLS_SETUP.md**: Added visual failure demonstration section with cross-references
- **docs/DOCUMENTATION.md**: Updated Quick Reference with visual failure demo commands
- **Documentation Structure**: Improved cross-referencing between related documentation files

### Fixed
- **Visual Test Reporting**: Clear demonstration of how Playwright HTML reports show visual differences
- **Applitools Integration**: Proper error handling and dashboard URL reporting for visual failures
- **Documentation Consistency**: Unified command structure across all documentation files

## [Unreleased]

### Added
- **Applitools Visual Testing**: AI-powered visual testing with Applitools Eyes integration
- **Dual Visual Testing**: Easy switching between Playwright screenshots and Applitools comparison
- **Applitools Fixtures**: Custom fixtures for seamless Applitools integration
- **Applitools Test Projects**: Separate test projects for Chrome, Edge, and Safari
- **Applitools Scripts**: New npm scripts for Applitools testing and browser-specific runs
- **Applitools Documentation**: Comprehensive guide in `docs/APPLITOOLS_SETUP.md`
- **Monocart Reporter**: High-performance tree grid reporter for large test suites
- **Four Reporter System**: Easy switching between Ortoni, Allure, Custom Steps, and Monocart reporters
- **Enhanced API Testing**: pw-api-plugin for beautiful API visualization and debugging
- **Schema Validation**: playwright-schema-validator for API contract validation
- **API Test Scripts**: New npm scripts for API testing with different themes and configurations
- **API Documentation**: Comprehensive guide for API testing plugins in `docs/API_PLUGINS.md`
- **Multiple Color Schemes**: Support for light, dark, and accessible themes in API visualization
- **Enhanced API Reports**: API details included in HTML reports and Trace Viewer
- Comprehensive documentation in `docs/` folder
- Three reporting systems: Ortoni, Allure, and Custom Steps reporters
- Multi-browser testing support (Chrome, Edge, Safari)
- Custom Specs Reporter with stakeholder-friendly interface
- Dynamic reporter switching via environment variables
- Enhanced debugging capabilities and techniques
- Comprehensive test execution guide
- Project-specific Cursor rules for development consistency

### Changed
- Removed Firefox browser support
- Updated project structure with organized documentation
- Enhanced `.gitignore` with comprehensive patterns
- Updated all documentation to reflect current browser configuration

### Fixed
- Firefox-related artifacts and configuration removed
- Documentation links updated to point to `docs/` folder
- Test configuration optimized for three-browser setup

## [0.1.0] - 2025-01-20

### Added
- Initial Playwright TypeScript testing framework
- POM-ish architecture with centralized selectors
- E2E tests for Restful Booker Platform
- API tests for RBP endpoints
- Visual regression testing with screenshots
- Ortoni reporting system
- Multi-browser project configuration
- Test fixtures and helpers
- Visual stability utilities
- Basic CI/CD integration with GitHub Actions

### Features
- **E2E Testing**: Authentication, room management, contact forms, navigation
- **API Testing**: Homepage, admin endpoints, HTTP methods, error handling
- **Visual Testing**: Page snapshots, component snapshots, responsive design
- **Cross-Browser**: Chrome, Edge, Safari, Mobile Chrome, Mobile Safari
- **Reporting**: Ortoni reports with charts, history, and auto-open
- **Architecture**: POM-ish approach with centralized selectors and small helpers

### Technical Details
- TypeScript strict mode enabled
- Playwright configuration with proper timeouts and retries
- Test data management with fixtures
- Screenshot and video capture on failures
- Trace files for debugging
- Responsive design testing across viewport sizes

---

## Version History

### Version 0.1.0
- **Release Date**: October 20, 2024
- **Status**: Initial release
- **Features**: Complete Playwright testing framework with POM-ish architecture
- **Browsers**: Chrome, Edge, Safari (Firefox removed)
- **Reporters**: Ortoni (default), Allure, Custom Steps
- **Documentation**: Comprehensive guides in `docs/` folder

---

## Contributing

When making changes to this project, please update this changelog by:

1. Adding your changes to the `[Unreleased]` section
2. Using the following categories:
   - `Added` for new features
   - `Changed` for changes in existing functionality
   - `Deprecated` for soon-to-be removed features
   - `Removed` for now removed features
   - `Fixed` for any bug fixes
   - `Security` for vulnerability fixes

3. Following the format:
   ```markdown
   ### Added
   - New feature description
   
   ### Changed
   - Description of what changed
   
   ### Fixed
   - Bug fix description
   ```

4. Moving items from `[Unreleased]` to a new version section when releasing

## Release Process

1. **Development**: Add changes to `[Unreleased]` section
2. **Testing**: Ensure all tests pass with all three reporters
3. **Documentation**: Update relevant documentation files
4. **Release**: Create new version section and update version numbers
5. **Tag**: Create git tag for the release
6. **Deploy**: Update CI/CD and deployment configurations

## Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

### Version Format
- `MAJOR.MINOR.PATCH` (e.g., `1.0.0`)
- Pre-release versions: `1.0.0-alpha.1`, `1.0.0-beta.1`
- Build metadata: `1.0.0+20241020`

## Links

- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Project Documentation](./docs/DOCUMENTATION.md)
- [Developer Guide](./docs/DEVELOPER.md)
