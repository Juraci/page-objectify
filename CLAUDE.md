# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Start WXT development server (hot-reload)
npm run build         # Build Chrome extension to .output/chrome-mv3/
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
npm run format:check  # Check formatting without modifying files
npm run test          # Run all tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

Run a single test file:
```bash
npx vitest run entrypoints/__tests__/content.test.ts
```

## Architecture

**Page Objectify** is a Chrome MV3 extension (built with [WXT](https://wxt.dev/)) that injects a side panel into any webpage and generates Playwright locator code for detected interactive elements.

### Flow

1. `entrypoints/content/index.ts` — content script entry point; injects a side panel into the page via **Shadow DOM** to avoid style leakage. Exports `createSidePanel()`, `analyze()`, and `injectSidePanel()`.
2. `entrypoints/content/panel.html` — UI template for the side panel (fixed right panel, dark Nord theme, 400px wide).
3. `entrypoints/content/wrapper.ts` — `Wrapper` class orchestrates all registered `ElementCollection` scanners and aggregates their results.
4. `entrypoints/content/collections/buttons.ts` — implements `ElementCollection` for buttons; scans the DOM for buttons with `data-*` attributes or `aria-label` and emits Playwright locator strings.

### Extending Element Detection

To support a new element type, create a file under `entrypoints/content/collections/` that implements the `ElementCollection` interface, then register it in `wrapper.ts`. The `Wrapper` runs all registered collections and merges their output.

### Testing

Tests live in `entrypoints/__tests__/`. The environment is **happy-dom** (via Vitest), so no real browser is required. Unit tests cover panel DOM construction; integration tests run a full analyze cycle against sample HTML fixtures.
