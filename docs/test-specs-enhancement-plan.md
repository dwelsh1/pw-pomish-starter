# Test Specs Sidebar Enhancement Plan

## Overview
Add a "Test Specs" section to the Specs Reporter sidebar that provides a hierarchical view of test specifications, allowing users to navigate from specs to individual tests with full functionality preservation.

## Current State Analysis
- **Existing Sidebar**: Dashboard and Tests sections
- **Current Tests Page**: Shows "Test Results by File" with direct test links
- **Current Functionality**: Copy Prompt buttons, test details, screenshots, videos
- **Data Structure**: Tests are grouped by file (spec) in `results.groupedResults`

## Proposed Changes

### 1. Sidebar Navigation Update
**File**: `src/reporter/templates/summary.html`

#### New Sidebar Structure:
```html
<div class="sidebar" id="sidebar">
  <div class="sidebar-header">
    <h2>Steps Reporter</h2>
  </div>
  <nav class="sidebar-nav">
    <div class="nav-item" onclick="showSection('dashboard')">
      <span class="material-symbols-outlined">dashboard</span>
      <span>Dashboard</span>
    </div>
    <div class="nav-item" onclick="showSection('specs')">
      <span class="material-symbols-outlined">description</span>
      <span>Test Specs</span>
    </div>
    <div class="nav-item" onclick="showSection('tests')">
      <span class="material-symbols-outlined">list</span>
      <span>Tests</span>
    </div>
  </nav>
</div>
```

### 2. New Content Section: Test Specs
**File**: `src/reporter/templates/summary.html`

#### Test Specs Content Structure:
```html
<div id="specs-content" class="content-section">
  <div class="test-specs-header">
    <h2>Test Specifications</h2>
    <p>Click on a spec to view its tests</p>
  </div>
  
  <div class="specs-list">
    <% Object.keys(results.groupedResults).forEach(function(fileName) { %>
      <div class="spec-item" onclick="showSpecTests('<%= fileName %>')">
        <div class="spec-header">
          <span class="material-symbols-outlined">description</span>
          <span class="spec-name"><%= fileName %></span>
          <span class="spec-count">(<%= results.groupedResults[fileName].length %> tests)</span>
        </div>
        <div class="spec-summary">
          <% 
            const specResults = results.groupedResults[fileName];
            const passed = specResults.filter(t => t.status === 'passed').length;
            const failed = specResults.filter(t => t.status === 'failed').length;
            const skipped = specResults.filter(t => t.status === 'skipped').length;
          %>
          <span class="status-badge passed"><%= passed %> passed</span>
          <span class="status-badge failed"><%= failed %> failed</span>
          <span class="status-badge skipped"><%= skipped %> skipped</span>
        </div>
      </div>
    <% }); %>
  </div>
</div>
```

### 3. Spec Tests View
**File**: `src/reporter/templates/summary.html`

#### Individual Spec Tests Content:
```html
<div id="spec-tests-content" class="content-section">
  <div class="spec-tests-header">
    <button class="back-button" onclick="showSection('specs')">
      <span class="material-symbols-outlined">arrow_back</span>
      Back to Specs
    </button>
    <h2 id="spec-tests-title">Spec Tests</h2>
  </div>
  
  <div id="spec-tests-list" class="tests-list">
    <!-- Dynamically populated with tests from selected spec -->
  </div>
</div>
```

### 4. JavaScript Functionality

#### New Navigation Functions:
```javascript
// Show Test Specs section
function showSection(sectionName) {
  // Hide all content sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
    section.classList.remove('active');
  });
  
  // Show selected section
  const targetSection = document.getElementById(sectionName + '-content');
  if (targetSection) {
    targetSection.style.display = 'block';
    targetSection.classList.add('active');
  }
  
  // Update active navigation state
  updateActiveNav(sectionName);
  
  // Update URL hash
  window.location.hash = sectionName;
}

// Show tests for a specific spec
function showSpecTests(fileName) {
  // Hide specs list, show spec tests
  document.getElementById('specs-content').style.display = 'none';
  document.getElementById('spec-tests-content').style.display = 'block';
  
  // Update title
  document.getElementById('spec-tests-title').textContent = `Tests in ${fileName}`;
  
  // Populate tests list
  populateSpecTests(fileName);
  
  // Update URL hash
  window.location.hash = `spec-${encodeURIComponent(fileName)}`;
}

// Populate tests for selected spec
function populateSpecTests(fileName) {
  const testsList = document.getElementById('spec-tests-list');
  const specTests = window.testData.groupedResults[fileName];
  
  if (!specTests) {
    testsList.innerHTML = '<p>No tests found for this spec.</p>';
    return;
  }
  
  let html = '';
  specTests.forEach(test => {
    html += `
      <div class="test-item" onclick="showTestDetail('${test.num}')">
        <div class="test-header">
          <span class="test-status status-${test.status}">${test.status}</span>
          <span class="test-title">${test.title}</span>
          <span class="test-duration">${test.duration}</span>
        </div>
        <div class="test-meta">
          <span class="test-browser">${test.browser}</span>
          <span class="test-file">${test.fileName}</span>
        </div>
        ${test.status === 'failed' ? `
          <div class="test-actions">
            <button class="copy-prompt-btn" onclick="event.stopPropagation(); copyPromptFromTestDetail('full', '${test.num}')">
              Copy Full Prompt
            </button>
            <button class="copy-prompt-btn" onclick="event.stopPropagation(); copyPromptFromTestDetail('quick', '${test.num}')">
              Copy Quick Prompt
            </button>
            <button class="copy-prompt-btn" onclick="event.stopPropagation(); copyPromptFromTestDetail('debug', '${test.num}')">
              Copy Debug Prompt
            </button>
          </div>
        ` : ''}
      </div>
    `;
  });
  
  testsList.innerHTML = html;
}

// Update active navigation state
function updateActiveNav(activeSection) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const activeItem = document.querySelector(`[onclick="showSection('${activeSection}')"]`);
  if (activeItem) {
    activeItem.classList.add('active');
  }
}
```

### 5. URL Hash Support

#### Enhanced Hash Handling:
```javascript
function handleHashOnLoad() {
  const hash = window.location.hash.substring(1);
  
  if (hash.startsWith('spec-')) {
    const fileName = decodeURIComponent(hash.substring(5));
    showSpecTests(fileName);
  } else if (hash === 'specs') {
    showSection('specs');
  } else if (hash === 'tests') {
    showSection('tests');
  } else if (hash === 'dashboard') {
    showSection('dashboard');
  } else if (hash.startsWith('test-')) {
    const testNum = hash.substring(5);
    showTestDetail(testNum);
  } else {
    showSection('dashboard');
  }
}

// Listen for hash changes
window.addEventListener('hashchange', handleHashOnLoad);
```

### 6. CSS Styling Updates

#### New CSS Classes:
```css
/* Test Specs Styling */
.test-specs-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.test-specs-header h2 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.test-specs-header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

.specs-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.spec-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.spec-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  border-color: #3498db;
}

.spec-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.spec-name {
  font-weight: 600;
  color: #2c3e50;
  flex: 1;
}

.spec-count {
  color: #7f8c8d;
  font-size: 14px;
}

.spec-summary {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.passed {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.failed {
  background-color: #f8d7da;
  color: #721c24;
}

.status-badge.skipped {
  background-color: #fff3cd;
  color: #856404;
}

/* Spec Tests View */
.spec-tests-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background: #2980b9;
}

#spec-tests-title {
  margin: 0;
  color: #2c3e50;
}

.tests-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.test-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.test-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.test-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.test-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.test-status.status-passed {
  background-color: #d4edda;
  color: #155724;
}

.test-status.status-failed {
  background-color: #f8d7da;
  color: #721c24;
}

.test-status.status-skipped {
  background-color: #fff3cd;
  color: #856404;
}

.test-title {
  font-weight: 600;
  color: #2c3e50;
  flex: 1;
}

.test-duration {
  color: #7f8c8d;
  font-size: 14px;
}

.test-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #7f8c8d;
}

.test-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.copy-prompt-btn {
  padding: 6px 12px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;
}

.copy-prompt-btn:hover {
  background: #c0392b;
}
```

### 7. Data Structure Enhancement

#### Global Test Data Object:
```javascript
// Enhanced global test data structure
window.testData = {
  groupedResults: {
    // This will be populated from the EJS template
    <% Object.keys(results.groupedResults).forEach(function(fileName) { %>
      '<%= fileName %>': [
        <% results.groupedResults[fileName].forEach(function(test, index) { %>
          {
            num: '<%= test.num %>',
            title: '<%= test.title %>',
            status: '<%= test.status %>',
            duration: '<%= test.duration %>',
            browser: '<%= test.browser %>',
            fileName: '<%= test.fileName %>',
            prompts: {
              <% if (test.prompts) { %>
                full: `<%= test.prompts.full.replace(/`/g, '\\\\`').replace(/\\$/g, '\\\\$') %>`,
                quick: `<%= test.prompts.quick.replace(/`/g, '\\\\`').replace(/\\$/g, '\\\\$') %>`,
                debug: `<%= test.prompts.debug.replace(/`/g, '\\\\`').replace(/\\$/g, '\\\\$') %>`
              <% } %>
            }
          }<%= index < results.groupedResults[fileName].length - 1 ? ',' : '' %>
        <% }); %>
      ]<%= Object.keys(results.groupedResults).indexOf(fileName) < Object.keys(results.groupedResults).length - 1 ? ',' : '' %>
    <% }); %>
  }
};
```

### 8. Implementation Steps

#### Phase 1: Sidebar Update
1. Add "Test Specs" navigation item to sidebar
2. Update navigation JavaScript to handle new section
3. Add CSS styling for new navigation item

#### Phase 2: Test Specs Page
1. Create `#specs-content` section with spec list
2. Implement `showSpecTests()` function
3. Add spec summary with status badges
4. Style spec items with hover effects

#### Phase 3: Spec Tests View
1. Create `#spec-tests-content` section
2. Implement `populateSpecTests()` function
3. Add back navigation functionality
4. Ensure test items have same functionality as Tests page

#### Phase 4: Data Integration
1. Enhance global test data structure
2. Ensure Copy Prompt functionality works
3. Test all navigation flows
4. Verify URL hash support

#### Phase 5: Testing & Polish
1. Test all navigation paths
2. Verify Copy Prompt buttons work
3. Test responsive design
4. Cross-browser compatibility

### 9. Files to Modify

#### Primary Files:
- `src/reporter/templates/summary.html` - Add Test Specs section and functionality

#### No New Files Required:
- All functionality will be added to existing template
- JavaScript functions will be added to existing script section
- CSS will be added to existing style section

### 10. Functionality Preservation

#### Maintained Features:
- ✅ Copy Prompt buttons (Full, Quick, Debug)
- ✅ Test detail viewing with screenshots/videos
- ✅ Individual test navigation
- ✅ Global prompt data storage
- ✅ Responsive design
- ✅ URL hash navigation
- ✅ All existing Dashboard and Tests functionality

#### New Features:
- 🆕 Test Specs hierarchical view
- 🆕 Spec-level test grouping
- 🆕 Spec summary with status counts
- 🆕 Back navigation from spec tests to specs
- 🆕 Enhanced navigation flow

### 11. Navigation Flow

#### User Journey:
1. **Dashboard** → Overview of all test results
2. **Test Specs** → List of all test specification files
3. **Click Spec** → Shows all tests within that spec
4. **Click Test** → Shows individual test details (same as current)
5. **Copy Prompt** → Works identically to current implementation

#### URL Structure:
- `#dashboard` - Dashboard section
- `#specs` - Test Specs section
- `#spec-[fileName]` - Tests within specific spec
- `#tests` - All tests section (current)
- `#test-[testNum]` - Individual test details

### 12. Success Criteria

#### Must Have:
- ✅ Test Specs section in sidebar
- ✅ Spec list with test counts and status summaries
- ✅ Clickable specs that show their tests
- ✅ Full Copy Prompt functionality preserved
- ✅ Individual test details work identically to Tests page
- ✅ Back navigation from spec tests to specs
- ✅ Responsive design maintained

#### Nice to Have:
- ✅ Smooth transitions between views
- ✅ Spec search/filter functionality
- ✅ Spec-level Copy Prompt (copy all failed tests in spec)
- ✅ Spec statistics and trends

### 13. Risk Assessment

#### Low Risk:
- ✅ Adding new sidebar item
- ✅ Creating new content sections
- ✅ JavaScript navigation functions

#### Medium Risk:
- ✅ Ensuring data structure compatibility
- ✅ Maintaining all existing functionality
- ✅ URL hash handling for new sections

#### Mitigation:
- ✅ Incremental implementation
- ✅ Preserve existing functionality as priority
- ✅ Test each phase thoroughly
- ✅ Fallback to current design if issues arise

### 14. Timeline Estimate
- **Phase 1**: 1 hour (Sidebar update)
- **Phase 2**: 2 hours (Test Specs page)
- **Phase 3**: 2 hours (Spec Tests view)
- **Phase 4**: 1 hour (Data integration)
- **Phase 5**: 1 hour (Testing & polish)
- **Total**: 7 hours

### 15. Dependencies
- ✅ No external dependencies required
- ✅ Uses existing CSS framework and libraries
- ✅ Maintains current template engine (EJS)
- ✅ Leverages existing global test data structure

## Summary

This enhancement adds a "Test Specs" section to the sidebar that provides a hierarchical view of test specifications. Users can navigate from specs to individual tests with full functionality preservation, including Copy Prompt buttons and test details. The implementation maintains all existing functionality while adding a new navigation path that's more organized and user-friendly.
