import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  detectDataTest,
  detectLabel,
  detectClass,
  detectPlaceholder,
  detectRole,
} from "../content/collections/detectors";

describe("detectDataTest", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("returns a locator for an element with a data-test attribute", () => {
    container.innerHTML = `<button data-test-submit-btn>Submit</button>`;
    const el = container.querySelector("button")!;
    expect(detectDataTest(el, document)).toBe("page.locator('[data-test-submit-btn]')");
  });

  it("returns null for an element with no data-test attribute", () => {
    container.innerHTML = `<button aria-label="Close">X</button>`;
    const el = container.querySelector("button")!;
    expect(detectDataTest(el, document)).toBeNull();
  });

  it("returns a locator for an input with a data-test attribute", () => {
    container.innerHTML = `<input data-test-search />`;
    const el = container.querySelector("input")!;
    expect(detectDataTest(el, document)).toBe("page.locator('[data-test-search]')");
  });

  it("matches data-test-* prefix (not just data-test)", () => {
    container.innerHTML = `<button data-testid="foo">Go</button>`;
    const el = container.querySelector("button")!;
    expect(detectDataTest(el, document)).toBe("page.locator('[data-testid]')");
  });
});

describe("detectLabel", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("returns getByLabel for an element with aria-label", () => {
    container.innerHTML = `<button aria-label="Close">X</button>`;
    const el = container.querySelector("button")!;
    expect(detectLabel(el, document)).toBe("page.getByLabel('Close')");
  });

  it("returns getByLabel for an input with an associated label element", () => {
    container.innerHTML = `<label for="q">Query</label><input id="q" />`;
    const el = container.querySelector("input")!;
    expect(detectLabel(el, document)).toBe("page.getByLabel('Query')");
  });

  it("returns null for an element with neither aria-label nor associated label", () => {
    container.innerHTML = `<input class="search-box" />`;
    const el = container.querySelector("input")!;
    expect(detectLabel(el, document)).toBeNull();
  });

  it("returns null for an element with id but no matching label", () => {
    container.innerHTML = `<input id="orphan" />`;
    const el = container.querySelector("input")!;
    expect(detectLabel(el, document)).toBeNull();
  });

  it("prefers aria-label over associated label element", () => {
    container.innerHTML = `<label for="f">From label</label><input id="f" aria-label="From aria" />`;
    const el = container.querySelector("input")!;
    expect(detectLabel(el, document)).toBe("page.getByLabel('From aria')");
  });
});

describe("detectClass", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("returns a locator for an element with a single class", () => {
    container.innerHTML = `<button class="reset-email">Forgot?</button>`;
    const el = container.querySelector("button")!;
    expect(detectClass(el, document)).toBe("page.locator('.reset-email')");
  });

  it("uses first two classes when element has multiple classes", () => {
    container.innerHTML = `<button class="btn btn-primary extra">Go</button>`;
    const el = container.querySelector("button")!;
    expect(detectClass(el, document)).toBe("page.locator('.btn.btn-primary')");
  });

  it("returns null for an element with no class", () => {
    container.innerHTML = `<button>Go</button>`;
    const el = container.querySelector("button")!;
    expect(detectClass(el, document)).toBeNull();
  });

  it("returns null for an element with whitespace-only class", () => {
    container.innerHTML = `<button class="   ">Go</button>`;
    const el = container.querySelector("button")!;
    expect(detectClass(el, document)).toBeNull();
  });
});

describe("detectPlaceholder", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("returns getByPlaceholder for an input with a long enough placeholder", () => {
    container.innerHTML = `<input placeholder="Enter name" />`;
    const el = container.querySelector("input")!;
    expect(detectPlaceholder(el, document)).toBe("page.getByPlaceholder('Enter name')");
  });

  it("returns getByPlaceholder for a textarea with a placeholder", () => {
    container.innerHTML = `<textarea placeholder="Write here"></textarea>`;
    const el = container.querySelector("textarea")!;
    expect(detectPlaceholder(el, document)).toBe("page.getByPlaceholder('Write here')");
  });

  it("returns null for a placeholder that is too short (3 chars or fewer)", () => {
    container.innerHTML = `<input placeholder="Hi" />`;
    const el = container.querySelector("input")!;
    expect(detectPlaceholder(el, document)).toBeNull();
  });

  it("returns null for an element with no placeholder", () => {
    container.innerHTML = `<input class="search-box" />`;
    const el = container.querySelector("input")!;
    expect(detectPlaceholder(el, document)).toBeNull();
  });
});

describe("detectRole", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("returns getByRole using the implicit role of a button element", () => {
    container.innerHTML = `<button>Submit</button>`;
    const el = container.querySelector("button")!;
    expect(detectRole(el, document)).toBe("page.getByRole('button', { name: 'Submit' })");
  });

  it("returns getByRole using an explicit role attribute", () => {
    container.innerHTML = `<div role="dialog">Open settings</div>`;
    const el = container.querySelector("div")!;
    expect(detectRole(el, document)).toBe("page.getByRole('dialog', { name: 'Open settings' })");
  });

  it("uses an explicit role attribute over the implicit tag role", () => {
    container.innerHTML = `<button role="menuitem">File</button>`;
    const el = container.querySelector("button")!;
    expect(detectRole(el, document)).toBe("page.getByRole('menuitem', { name: 'File' })");
  });

  it("returns getByRole for an anchor element", () => {
    container.innerHTML = `<a href="#">Go home</a>`;
    const el = container.querySelector("a")!;
    expect(detectRole(el, document)).toBe("page.getByRole('link', { name: 'Go home' })");
  });

  it("returns null when text content is too short (3 chars or fewer)", () => {
    container.innerHTML = `<button>OK</button>`;
    const el = container.querySelector("button")!;
    expect(detectRole(el, document)).toBeNull();
  });

  it("returns null when there is no text content", () => {
    container.innerHTML = `<button></button>`;
    const el = container.querySelector("button")!;
    expect(detectRole(el, document)).toBeNull();
  });

  it("returns null for an element with no implicit or explicit role", () => {
    container.innerHTML = `<span>Some text here</span>`;
    const el = container.querySelector("span")!;
    expect(detectRole(el, document)).toBeNull();
  });
});
