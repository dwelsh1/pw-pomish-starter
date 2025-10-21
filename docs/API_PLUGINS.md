# API Testing Plugins

This project includes two powerful Playwright plugins for enhanced API testing:

## 📊 pw-api-plugin

**Enhanced API visualization and debugging for Playwright tests**

### Features
- **Beautiful API visualization** in Playwright UI, HTML reports, and Trace Viewer
- **Support for both Playwright native API and Axios** requests
- **Multiple color schemes** (light, dark, accessible)
- **Detailed request/response information** with timing and headers
- **Enhanced debugging** with clickable API call details

### Configuration

The plugin is configured via environment variables in `playwright.config.ts`:

```typescript
// pw-api-plugin configuration
const LOG_API_UI = process.env.LOG_API_UI !== 'false'; // Enable API details in Playwright UI (default: true)
const LOG_API_REPORT = process.env.LOG_API_REPORT === 'true'; // Enable API details in HTML reports (default: false)
const COLOR_SCHEME = process.env.COLOR_SCHEME || 'light'; // 'light', 'dark', or 'accessible'
```

### Usage

```typescript
import { pwApi } from 'pw-api-plugin';

test('API test with enhanced visualization', async ({ page }) => {
  // GET request
  const response = await pwApi.get({ page }, 'https://api.example.com/data');
  expect(response.status()).toBe(200);
  
  // POST request
  const postResponse = await pwApi.post({ page }, 'https://api.example.com/create', {
    data: { name: 'test', value: 123 }
  });
  
  // PUT request
  const putResponse = await pwApi.put({ page }, 'https://api.example.com/update/1', {
    data: { name: 'updated' }
  });
  
  // DELETE request
  const deleteResponse = await pwApi.delete({ page }, 'https://api.example.com/delete/1');
  
  // HEAD request
  const headResponse = await pwApi.head({ page }, 'https://api.example.com/data');
  
  // Custom fetch
  const fetchResponse = await pwApi.fetch({ page }, 'https://api.example.com/data', {
    method: 'OPTIONS'
  });
});
```

### Available Methods
- `pwApi.get({ page }, url, options?)`
- `pwApi.post({ page }, url, options?)`
- `pwApi.put({ page }, url, options?)`
- `pwApi.patch({ page }, url, options?)`
- `pwApi.delete({ page }, url, options?)`
- `pwApi.head({ page }, url, options?)`
- `pwApi.fetch({ page }, url, options?)`

### Color Schemes
- **Light** (default): Balanced light tones for general use
- **Dark**: Dark background for low-light environments
- **Accessible**: High-contrast colors meeting WCAG 2.1 AA standards

## 🔍 playwright-schema-validator

**API schema validation for Playwright tests**

### Features
- **JSON Schema validation** using AJV
- **Swagger/OpenAPI schema support**
- **Zod schema validation**
- **Lightweight and fast**
- **Seamless Playwright integration**

### Usage

```typescript
import { validateSchema } from 'playwright-schema-validator';

// JSON Schema validation
const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' }
  },
  required: ['id', 'name', 'email']
};

test('API response schema validation', async ({ page }) => {
  const response = await pwApi.get({ page }, 'https://api.example.com/users/1');
  const data = await response.json();
  
  // Validate response against schema
  await validateSchema(page, data, userSchema);
  
  expect(response.status()).toBe(200);
});
```

### Schema Types Supported
- **JSON Schema**: Standard JSON Schema format
- **Swagger/OpenAPI**: OpenAPI specification schemas
- **Zod**: TypeScript-first schema validation

## 🚀 Running API Tests

### Basic Commands
```bash
# Run all API tests
npm run test:api

# Run API tests with UI visualization
npm run test:api:ui

# Run API tests with HTML report details
npm run test:api:report

# Run API tests with dark theme
npm run test:api:dark

# Run API tests with accessible theme
npm run test:api:accessible
```

### Environment Variables
```bash
# Enable/disable API UI visualization (default: true)
LOG_API_UI=true

# Enable/disable API report details (default: false)
LOG_API_REPORT=true

# Set color scheme (light, dark, accessible)
COLOR_SCHEME=dark
```

## 📈 Benefits

### pw-api-plugin Benefits
- **Enhanced debugging**: Click on API calls in Playwright UI to see detailed request/response
- **Better reports**: API details included in HTML reports and Trace Viewer
- **Visual clarity**: Multiple color schemes for different environments
- **Timing information**: Automatic response timing and performance metrics
- **Header inspection**: Easy access to request/response headers

### playwright-schema-validator Benefits
- **Contract validation**: Ensures API responses match expected schemas
- **Early error detection**: Catches API contract violations immediately
- **Type safety**: Validates data types and required fields
- **Documentation**: Schemas serve as living documentation
- **Regression prevention**: Prevents breaking changes from going unnoticed

## 🔧 Integration with Existing Reporters

Both plugins work seamlessly with your existing reporting setup:

- **Ortoni Reports**: API details included in Ortoni HTML reports
- **Allure Reports**: API calls tracked in Allure test results
- **Custom Steps Reporter**: API calls included in custom step reports

## 📝 Example Test File

See `tests/api/rbp-api.spec.ts` for complete examples of both plugins in action.

## 🎯 Best Practices

1. **Use pw-api-plugin for all API calls** to get enhanced visualization
2. **Add schema validation** for critical API endpoints
3. **Enable LOG_API_REPORT=true** for CI/CD environments
4. **Use appropriate color schemes** for your environment
5. **Combine both plugins** for comprehensive API testing

## 🔗 References

- [pw-api-plugin GitHub](https://github.com/sclavijosuero/pw-api-plugin)
- [playwright-schema-validator GitHub](https://github.com/sclavijosuero/playwright-schema-validator)
- [JSON Schema Documentation](https://json-schema.org/)
- [Zod Documentation](https://zod.dev/)
