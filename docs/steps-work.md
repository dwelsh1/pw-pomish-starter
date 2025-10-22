# Specs Reporter Sidebar Enhancement Plan

## Overview
Add a sidebar navigation to the Specs reporter similar to Ortoni and Allure, with Dashboard and Tests sections that dynamically show content in the main area.

## Current State Analysis
- **Summary Template**: `src/reporter/templates/summary.html` - Contains dashboard with charts and test groups
- **Individual Template**: `src/reporter/templates/stepReporter.html` - Individual test details
- **Current Layout**: Single-page layout with no navigation structure
- **Current Functionality**: Direct links to individual tests, charts, and test summaries

## Proposed Changes

### 1. Layout Restructure
**File**: `src/reporter/templates/summary.html`

#### Current Structure:
```html
<body>
  <div class="container">
    <div class="header">...</div>
    <div class="charts">...</div>
    <div class="test-groups">...</div>
  </div>
</body>
```

#### New Structure:
```html
<body>
  <div class="app-layout">
    <div class="sidebar">
      <!-- Navigation sidebar -->
    </div>
    <div class="main-content">
      <div class="content-area">
        <!-- Dynamic content based on sidebar selection -->
      </div>
    </div>
  </div>
</body>
```

### 2. Sidebar Implementation

#### Sidebar Components:
- **Logo/Header**: "Specs Reporter" branding
- **Navigation Items**:
  - Dashboard (with dashboard icon)
  - Tests (with list icon)
- **Active State**: Visual indication of selected section
- **Responsive Design**: Collapsible on mobile

#### Sidebar Styling:
- Fixed width: 250px
- Dark theme: #2c3e50 background
- Hover effects and transitions
- Material Icons for navigation items

### 3. Content Area Management

#### Dashboard Section:
- Move existing dashboard content (charts, summary cards) to `#dashboard-content`
- Include:
  - Test summary cards (total, passed, failed, skipped)
  - Interactive charts (pie chart, bar chart)
  - Quick stats and metrics

#### Tests Section:
- Move existing test groups to `#tests-content`
- Include:
  - Test Results by File section
  - Expandable file groups
  - Direct links to individual tests
  - Test status indicators

### 4. JavaScript Functionality

#### Navigation Logic:
```javascript
function showSection(sectionName) {
  // Hide all content sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Show selected section
  document.getElementById(sectionName + '-content').style.display = 'block';
  
  // Update active navigation state
  updateActiveNav(sectionName);
}
```

#### Features:
- Smooth transitions between sections
- URL hash support for direct navigation
- Maintain scroll position per section
- Keyboard navigation support

### 5. CSS Updates

#### New CSS Classes:
```css
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.main-content {
  margin-left: 250px;
  flex: 1;
  padding: 20px;
}

.content-section {
  display: none;
}

.content-section.active {
  display: block;
}

.nav-item {
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav-item:hover {
  background-color: #34495e;
}

.nav-item.active {
  background-color: #3498db;
}
```

### 6. Responsive Design

#### Mobile Considerations:
- Sidebar becomes overlay/drawer
- Hamburger menu for mobile
- Touch-friendly navigation
- Maintain functionality on small screens

#### Breakpoints:
- Desktop: > 1024px (full sidebar)
- Tablet: 768px - 1024px (collapsible sidebar)
- Mobile: < 768px (overlay sidebar)

### 7. Backward Compatibility

#### Preserve Existing Functionality:
- All existing links continue to work
- Individual test pages remain unchanged
- Copy Prompt functionality preserved
- Charts and visualizations maintained
- Direct URL access to specific tests

#### URL Structure:
- `#dashboard` - Shows dashboard section
- `#tests` - Shows tests section
- Individual test URLs remain: `/[test-number]/index.html`

### 8. Implementation Steps

#### Phase 1: Layout Restructure
1. Update `summary.html` template structure
2. Add sidebar HTML and CSS
3. Create content sections for Dashboard and Tests
4. Implement basic navigation JavaScript

#### Phase 2: Content Migration
1. Move dashboard content to `#dashboard-content`
2. Move test groups to `#tests-content`
3. Ensure all existing functionality works
4. Test responsive design

#### Phase 3: Enhancement
1. Add smooth transitions
2. Implement URL hash support
3. Add keyboard navigation
4. Polish styling and animations

#### Phase 4: Testing
1. Test all existing functionality
2. Verify Copy Prompt buttons work
3. Test responsive design
4. Cross-browser compatibility

### 9. Files to Modify

#### Primary Files:
- `src/reporter/templates/summary.html` - Main template restructure
- `src/reporter/templates/stepReporter.html` - Individual test template (minimal changes)

#### Potential New Files:
- `src/reporter/templates/components/sidebar.html` - Reusable sidebar component
- `src/reporter/templates/components/dashboard.html` - Dashboard content component
- `src/reporter/templates/components/tests.html` - Tests content component

### 10. Testing Strategy

#### Functionality Tests:
- [ ] Sidebar navigation works correctly
- [ ] Dashboard section displays properly
- [ ] Tests section displays properly
- [ ] Individual test links work
- [ ] Copy Prompt buttons function
- [ ] Charts render correctly
- [ ] Responsive design works

#### Browser Tests:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### 11. Success Criteria

#### Must Have:
- Sidebar navigation with Dashboard and Tests sections
- All existing functionality preserved
- Responsive design
- Clean, professional appearance

#### Nice to Have:
- Smooth animations
- URL hash support
- Keyboard navigation
- Breadcrumb navigation
- Search functionality

## Risk Assessment

#### Low Risk:
- CSS and HTML changes
- JavaScript navigation logic
- Responsive design implementation

#### Medium Risk:
- Ensuring backward compatibility
- Maintaining all existing functionality
- Cross-browser compatibility

#### Mitigation:
- Incremental implementation
- Thorough testing at each phase
- Preserve existing functionality as priority
- Fallback to current design if issues arise

## Timeline Estimate
- **Phase 1**: 2-3 hours (Layout restructure)
- **Phase 2**: 1-2 hours (Content migration)
- **Phase 3**: 1-2 hours (Enhancement)
- **Phase 4**: 1 hour (Testing)
- **Total**: 5-8 hours

## Dependencies
- No external dependencies required
- Uses existing CSS framework and libraries
- Maintains current template engine (EJS)
