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

Release a new version:
```bash
git tag v1.2.3 && git push --tags
./bin/release.sh   # syncs package.json version, builds, zips to .output/page-raptor-v1.2.3.zip
```

Run a single test file:
```bash
npx vitest run entrypoints/__tests__/content.test.ts
```

## Architecture

**Page Objectify** is a Chrome MV3 extension (built with [WXT](https://wxt.dev/)) that injects a side panel into any webpage and generates Playwright locator code for detected interactive elements.

### Flow

1. `entrypoints/content/index.ts` — content script entry point; mounts `SidePanel.vue` into the page via WXT's `createShadowRootUi` (Shadow DOM, no style leakage).
2. `entrypoints/content/SidePanel.vue` — root Vue component; owns panel visibility, triggers analysis, passes results to `ResultsPanel.vue`.
3. `entrypoints/content/DetectorList.vue` — renders the draggable, checkbox-enabled detector priority list; exposes `getActiveDetectors()` to the parent.
4. `entrypoints/content/ResultsPanel.vue` — displays syntax-highlighted locator results with a copy button.
5. `entrypoints/content/wrapper.ts` — `Wrapper` class orchestrates all registered `ElementCollection` scanners and aggregates their results.
6. `entrypoints/content/collections/buttons.ts` — implements `ElementCollection` for buttons; receives an ordered `Detector[]` via constructor and emits Playwright locator strings.
7. `entrypoints/content/collections/inputs.ts` — implements `ElementCollection` for inputs and textareas; same `Detector[]` pattern.

### Detectors

`entrypoints/content/collections/detectors.ts` exports the `Detector` type and all detector functions:

```typescript
type Detector = (el: HTMLElement, document: Document) => string | null;
```

Each detector returns a Playwright locator string or `null` if it cannot match the element. Collections try detectors in array order and use the first non-null result.

| Export | Matches | Locator produced |
|---|---|---|
| `detectDataTest` | any `data-test*` attribute | `page.locator('[data-test-id]')` |
| `detectLabel` | `aria-label` or `<label for="">` | `page.getByLabel('...')` |
| `detectClass` | `className` (first 2 classes) | `page.locator('.a.b')` |
| `detectPlaceholder` | `placeholder` (length > 3) | `page.getByPlaceholder('...')` |
| `detectRole` | implicit ARIA role from tag (`button`, `a`) or explicit `role` attr + text content (length > 3) | `page.getByRole('button', { name: '...' })` |

The panel reads the current state of `#detector-list` (DOM order = priority, checkboxes = enabled) on every "Analyze Page" click via `buildDetectors()` in `index.ts`. Both `Buttons` and `Inputs` receive the same resolved detector array.

### Extending Element Detection

To add a new detector: export a `Detector` function from `detectors.ts`, add it to `DETECTOR_MAP` in `index.ts`, and add a corresponding `<li data-detector="...">` to `#detector-list` in `panel.html`.

To support a new element type, create a file under `entrypoints/content/collections/` that implements the `ElementCollection` interface (accepts `Detector[]` in constructor), then register it in `wrapper.ts`.

### Testing

Tests live in `entrypoints/__tests__/`. The environment is **happy-dom** (via Vitest), so no real browser is required. Vue component tests use `@vue/test-utils` (`SidePanel.test.ts`, `DetectorList.test.ts`, `ResultsPanel.test.ts`); integration tests run a full analyze cycle against sample HTML fixtures.
