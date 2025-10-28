# 🚀 Quick Test Commands Reference

## All Tests (E2E + API + Visual)
```bash
npm run all          # E2E + API (all browsers)
npm run all:e2e      # E2E tests (all browsers)  
npm run all:api      # API tests only
npm run all:visual   # Visual tests (all browsers)
```

## Chrome Only
```bash
npm run chrome       # E2E + API (Chrome)
npm run chrome:e2e   # E2E tests (Chrome)
npm run chrome:api   # API tests (Chrome)
npm run chrome:visual # Visual tests (Chrome)
```

## Edge Only
```bash
npm run edge         # E2E + API (Edge)
npm run edge:e2e     # E2E tests (Edge)
npm run edge:api     # API tests (Edge)
npm run edge:visual  # Visual tests (Edge)
```

## Safari Only
```bash
npm run safari       # E2E + API (Safari)
npm run safari:e2e   # E2E tests (Safari)
npm run safari:api   # API tests (Safari)
npm run safari:visual # Visual tests (Safari)
```

## Single Spec Commands
```bash
# Run a single spec with all browsers
npx playwright test tests/e2e/rbp-working.spec.ts --project=rbp-chromium --project=rbp-edge --project=rbp-webkit

# Run a single spec with Chrome only
npx playwright test tests/e2e/rbp-working.spec.ts --project=rbp-chromium
```

## Single Test Commands
```bash
# Run a single test with all browsers
npx playwright test tests/e2e/rbp-working.spec.ts -g "should load homepage successfully" --project=rbp-chromium --project=rbp-edge --project=rbp-webkit

# Run a single test with Chrome only
npx playwright test tests/e2e/rbp-working.spec.ts -g "should load homepage successfully" --project=rbp-chromium
```

## Open Reports
```bash
npm run specs:open   # Open Specs Reporter
```

## Notes
- All commands use the **Specs Reporter** by default
- Commands automatically handle multi-project execution
- Results are accumulated across all browsers/projects
- Use `npm run specs:open` to view the comprehensive report
- Single spec/test commands require specifying the exact file path and test name
- Use `-g` flag to run specific tests by name pattern
