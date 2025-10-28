# Test Categories & Tags Enhancement Plan

## 📊 Current State
- Basic tags are captured from Playwright test annotations
- Tags are displayed in test details
- Tags can be filtered in the Tests section
- Tags are stored without the `@` prefix for consistency

## 🎯 Vision
Create a robust tagging and categorization system that helps test teams organize, filter, analyze, and report on tests efficiently across all browsers and spec files.

---

## 📅 Phase 1: Tag Management & Consistency (Week 3-4)
**Goal**: Establish a solid foundation for tag handling

### 1.1 Tag Normalization
- ✅ Normalize tags at collection time (already done - removing `@` prefix)
- ⬜ Store normalized tags with original casing preserved for display
- ⬜ Create tag validation rules (no spaces, length limits, allowed characters)
- ⬜ Add warning for unknown/invalid tags in console

**Implementation**:
```typescript
// In SpecsReporter.ts
private normalizeTag(tag: string): string {
    return tag.replace(/^@/, '').trim();
}

private validateTag(tag: string): boolean {
    // No spaces, max 50 chars, alphanumeric + dash/underscore
    return /^[a-zA-Z0-9_-]{1,50}$/.test(tag);
}
```

### 1.2 Tag Categories (Basic)
- ⬜ Define category mapping configuration
- ⬜ Add category badge styling
- ⬜ Group tags by category in UI

**Tag Categories**:
- **Priority**: @smoke, @critical, @regression, @low-priority
- **Type**: @e2e, @api, @visual, @unit
- **Area**: @ui, @backend, @database, @auth
- **Status**: @todo, @wip, @skip

**Configuration File** (`src/reporter/tag-config.ts`):
```typescript
export const TagCategories = {
    priority: ['smoke', 'critical', 'regression', 'low-priority'],
    type: ['e2e', 'api', 'visual', 'unit'],
    area: ['ui', 'backend', 'database', 'auth', 'booking', 'admin'],
    status: ['todo', 'wip', 'skip', 'blocked']
};

export const CategoryMeta = {
    priority: { color: '#3498db', icon: 'priority' },
    type: { color: '#9b59b6', icon: 'category' },
    area: { color: '#e67e22', icon: 'place' },
    status: { color: '#7f8c8d', icon: 'flag' }
};
```

### 1.3 Tag Display Enhancement
- ⬜ Show category badges in test details
- ⬜ Add color-coded tag chips
- ⬜ Display tag tooltips with category info

---

## 📅 Phase 2: Improved Tag Filtering (Week 5-6)
**Goal**: Make tag filtering more powerful and user-friendly

### 2.1 Multi-Tag Selection
- ⬜ Add multi-select dropdown for tags
- ⬜ Support AND/OR filter modes
- ⬜ Show active filter chips
- ⬜ Add "Clear All Tags" button

**UI Enhancement**:
```typescript
// Filter by multiple tags with AND/OR logic
// AND: Test must have ALL selected tags
// OR: Test must have ANY of the selected tags
```

### 2.2 Tag Statistics
- ⬜ Show tag count per category on Dashboard
- ⬜ Display tag frequency chart
- ⬜ Highlight most-used tags
- ⬜ Show untagged tests count

### 2.3 Filter Persistence
- ⬜ Save active filters to localStorage
- ⬜ Restore filters on page reload
- ⬜ Add filter state to URL hash for shareable links

**Implementation**:
```typescript
// Save to localStorage
localStorage.setItem('specs-filters', JSON.stringify(currentFilters));

// Restore on page load
const savedFilters = localStorage.getItem('specs-filters');
if (savedFilters) {
    currentFilters = JSON.parse(savedFilters);
    applyFilters();
}
```

---

## 📅 Phase 3: Tag Analytics & Reporting (Week 7-8)
**Goal**: Provide insights into test organization

### 3.1 Tag Dashboard Widget
- ⬜ Add "Test Tags Overview" section to Dashboard
- ⬜ Show tag distribution pie chart
- ⬜ Display top 10 most common tags
- ⬜ Show tag coverage percentage

**Visualization**:
- Bar chart: Top tags by frequency
- Donut chart: Tags by category
- Tag cloud: Visual representation of tags

### 3.2 Tag Reporting
- ⬜ Generate tag-based test groupings
- ⬜ Export tag statistics
- ⬜ Show tag coverage per spec file
- ⬜ Display missing tags warnings

### 3.3 Tag Recommendations
- ⬜ Suggest tags based on test content
- ⬜ Identify commonly used tag combinations
- ⬜ Recommend tags for untagged tests

---

## 📅 Phase 4: Advanced Tag Features (Week 9-10)
**Goal**: Enterprise-grade tag management

### 4.1 Tag Aliases
- ⬜ Define tag aliases (e.g., `smoke` = `@smoke`, `@critical-smoke`)
- ⬜ Support legacy tag migration
- ⬜ Auto-suggest tag corrections

### 4.2 Tag Hierarchies
- ⬜ Parent-child tag relationships
- ⬜ Tag grouping and nesting
- ⬜ Inherit parent tag filters

**Example**:
```
@ui
  ├─ @login
  ├─ @booking
  └─ @admin
@api
  ├─ @auth
  ├─ @booking
  └─ @health
```

### 4.3 Tag-Based Test Execution
- ⬜ Filter tests by tags in CLI
- ⬜ Run only specific tag combinations
- ⬜ Tag-based test scheduling

**CLI Integration**:
```bash
npx playwright test --tag=@smoke --tag=@critical
```

---

## 📅 Phase 5: Integration & Automation (Week 11-12)
**Goal**: Seamless integration with workflows

### 5.1 CI/CD Tag Integration
- ⬜ Tag-based test selection in CI
- ⬜ Conditional test execution by tags
- ⬜ Tag-based parallelization

**GitHub Actions Example**:
```yaml
- name: Run Smoke Tests
  run: npx playwright test --tag=@smoke
  
- name: Run Critical Tests
  run: npx playwright test --tag=@critical
```

### 5.2 Test Management Tool Integration
- ⬜ Export tags to test management tools
- ⬜ Import tags from external sources
- ⬜ Sync tags between systems

### 5.3 Tag Analytics Dashboard
- ⬜ Track tag usage over time
- ⬜ Identify tag patterns
- ⬜ Suggest tag consolidation
- ⬜ Monitor tag coverage trends

---

## 🎨 UI/UX Enhancements

### Visual Improvements
- **Tag Chips**: Color-coded category badges
- **Tag Icons**: Material symbols for categories
- **Tag Tooltips**: Show descriptions and usage
- **Tag Filter Dropdown**: Searchable multi-select
- **Active Filter Chips**: Easy removal

### Interaction Improvements
- **AND/OR Toggle**: Switch filter logic
- **Quick Filters**: Preset tag combinations
- **Tag Cloud**: Visual frequency display
- **Keyboard Shortcuts**: Navigate filters faster

---

## 📊 Implementation Order

### Must Have (Phase 1-2)
1. ✅ Tag normalization (COMPLETE)
2. ⬜ Tag categories configuration
3. ⬜ Multi-tag filtering with AND/OR
4. ⬜ Filter persistence in localStorage
5. ⬜ Tag statistics on Dashboard

### Should Have (Phase 3)
6. ⬜ Tag distribution charts
7. ⬜ Tag coverage reporting
8. ⬜ Untagged tests identification

### Nice to Have (Phase 4-5)
9. ⬜ Tag aliases and hierarchies
10. ⬜ Advanced analytics
11. ⬜ CI/CD integration
12. ⬜ External tool integration

---

## 🔧 Technical Implementation

### Files to Modify
1. `src/reporter/SpecsReporter.ts` - Tag collection and normalization
2. `src/reporter/types.ts` - Tag category definitions
3. `src/reporter/templates/summary.html` - Tag filtering UI and logic
4. `docs/specs-reporter.md` - Documentation updates

### New Files to Create
1. `src/reporter/tag-config.ts` - Tag category configuration
2. `src/reporter/tag-utils.ts` - Tag utility functions

### Testing Strategy
1. Add sample tests with various tags
2. Test filtering with multiple tags
3. Verify filter persistence
4. Test tag statistics accuracy
5. Validate tag validation rules

---

## 📝 Success Metrics

### Phase 1 Success
- ✅ All tags normalized and validated
- ✅ Categories defined and displayed
- ✅ Tag validation rules enforced

### Phase 2 Success
- ✅ Multi-tag filtering working
- ✅ AND/OR modes functional
- ✅ Filters persist across sessions

### Phase 3 Success
- ✅ Tag statistics displayed
- ✅ Coverage metrics available
- ✅ Untagged tests identified

### Phase 4-5 Success
- ✅ Advanced features working
- ✅ CI/CD integration complete
- ✅ Analytics dashboard functional

---

## 🚀 Quick Wins (Can Implement Immediately)

### Easy Wins
1. **Tag Display** - Color-code tags by category (1 day)
2. **Tag Stats** - Show tag count on Dashboard (1 day)
3. **Filter Persistence** - Save/restore filters (2 days)
4. **Multi-Select** - Allow selecting multiple tags (2 days)

### Medium Wins
5. **Tag Charts** - Add tag distribution charts (3 days)
6. **AND/OR Logic** - Implement filter logic toggle (3 days)
7. **Tag Validation** - Add validation rules (2 days)

### Complex Wins
8. **Tag Categories** - Full category system (5 days)
9. **Tag Analytics** - Comprehensive dashboard (5 days)
10. **CI/CD Integration** - External integrations (5 days)

---

## 🎯 Recommended Starting Point

**Start with Phase 1 (Week 3-4)** as it provides immediate value:

1. **Week 3.1**: Add tag categories configuration
2. **Week 3.2**: Color-code tag badges by category
3. **Week 3.3**: Implement tag validation
4. **Week 4.1**: Multi-tag selection UI
5. **Week 4.2**: Filter persistence
6. **Week 4.3**: Tag statistics on Dashboard

This approach delivers measurable improvements quickly while setting the foundation for advanced features.

---

## 📚 Documentation Updates

### Files to Update
1. `docs/specs-reporter.md` - Tag usage guide
2. `docs/roadmap.md` - Update status
3. `README.md` - Tag filtering examples
4. Create `docs/tag-guide.md` - Comprehensive tag guide

### New Documentation
- **Tag Best Practices** - How to tag tests effectively
- **Tag Examples** - Sample tag combinations
- **Tag Reference** - All available tags and categories

---

## 🎁 Expected Benefits

### For Testers
- ✅ Easier test discovery and organization
- ✅ Better test filtering and grouping
- ✅ Improved test maintenance

### For Managers
- ✅ Better test coverage visibility
- ✅ Tag-based reporting and analytics
- ✅ Test suite organization insights

### For Developers
- ✅ Understand test structure
- ✅ Identify gaps in test coverage
- ✅ Optimize test execution

---

## ⚠️ Potential Challenges

1. **Tag Sprawl**: Need tag governance and standards
2. **Performance**: Large test suites with many tags
3. **Migration**: Existing tests may need retagging
4. **Consistency**: Ensuring team-wide tag usage

### Solutions
- Provide tag guidelines and validation
- Optimize filtering for large datasets
- Create migration utilities
- Use tag suggestions and auto-completion

