# Page Raptor

A Chrome extension that scans any webpage and generates [Playwright](https://playwright.dev/) locator code for interactive elements.

## What it does

Inject a side panel into any page, click **Analyze Page**, and get ready-to-use Playwright locators for all detected buttons and inputs — prioritizing stable selectors like `data-test` attributes, ARIA labels, roles, and placeholders over fragile class-based ones.

## Features

- Detects buttons, inputs, and textareas
- Generates `getByLabel`, `getByRole`, `getByPlaceholder`, and `locator(...)` calls
- Configurable detection priority — drag to reorder, toggle detectors on/off
- Copy results to clipboard with one click
- Isolated via Shadow DOM — no style conflicts with the host page

## Development

```bash
npm install
npm run dev      # start with hot-reload
npm run build    # build for Chrome MV3
npm run test     # run tests
```

Load the extension from `.output/chrome-mv3/` in Chrome's `chrome://extensions` page (Developer mode on).
