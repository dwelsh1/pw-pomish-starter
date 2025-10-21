# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- Custom Steps Reporter with stakeholder-friendly interface
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
