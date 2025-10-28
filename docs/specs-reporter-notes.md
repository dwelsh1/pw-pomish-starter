# Specs Reporter Notes

## ✅ Recent Fixes & Enhancements

### Settings Feature Added (NEW!)
- **Location**: Settings section in sidebar navigation
- **Features**:
  - Toggle to show/hide Videos in test details
  - Toggle to show/hide Screenshots in test details  
- **Persistence**: Settings saved to localStorage and persist across sessions
- **How it works**: Settings apply to all test detail pages (both inline and in new tabs)

### Filtering System Enhanced
- **Status**: ✅ Fully functional
- **Features**: Filter by Status, Duration, Browser, Tags, and Search
- **Fix**: Added CSS specificity rule for `.filtered-out` to properly hide items

### Attachment Downloads Fixed
- **Status**: ✅ Fixed
- **Solution**: Removed `target="_blank"` from attachment links so the `download` attribute works properly
- **Result**: Clicking error-context.md or trace.zip now downloads the files instead of opening them

### Test Detail Loading Fixed
- **Status**: ✅ Fixed
- **Solution**: Test details now open in new tabs when using `file://` protocol
- **Back to Summary**: Fixed link from `summary.html` to `index.html`

### Full-Page Screenshots Enabled
- **Status**: ✅ Enabled
- **Configuration**: Changed to `screenshot: { mode: 'only-on-failure', fullPage: true }`
- **Result**: Screenshots now capture entire page (not just viewport)

## Known Limitations

### Video Duration
- **Issue**: Videos may show short durations (e.g., 0.07s) even when tests run for 16+ seconds
- **Cause**: In `playwright.config.ts`, video is set to `retain-on-failure`
- **Explanation**: This setting only records video from when the failure occurs, not from the beginning of the test
- **Solution**: For full video coverage, change `video: 'retain-on-failure'` to `video: 'on'` in playwright.config.ts
- **Trade-off**: Full videos use significantly more disk space

### Screenshots Showing Elements Off-Screen
- **Issue**: Screenshots capture full page, but may not show where error occurred if element is off-screen
- **Cause**: Screenshots are taken at failure time, showing final page state
- **Explanation**: If your test scrolls to click an element at the bottom, the full-page screenshot shows the entire page but the element clicked might not be visible in the screenshot
- **Solution**: 
  1. **Use the Trace file (.zip)** - Shows the full timeline and you can see exactly what was clicked
  2. **Search in screenshot** - Since it's full-page, you can scroll through the screenshot to find elements

## Best Practices

1. **For detailed debugging**: Always use the **trace.zip** file which contains a complete timeline
2. **For video recording**: If you need full test videos, adjust `video` setting in playwright.config.ts
3. **For screenshots**: Full-page screenshots are now enabled by default for better debugging
4. **For media control**: Use the Settings section to toggle videos/screenshots visibility
5. **For filtering**: Use the sidebar filters to quickly find specific tests by status, duration, browser, or tags

