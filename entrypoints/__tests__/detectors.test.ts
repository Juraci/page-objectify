import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  DataTest,
  Label,
  CssClass,
  Placeholder,
  Role,
  Detectors,
  NullDetector,
} from "../content/collections/detectors";

describe("DataTest", () => {
  let container: HTMLDivElement;
  let detector: DataTest;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    detector = new DataTest();
  });

  afterEach(() => {
    container.remove();
  });

  it("returns a locator for an element with a data-test attribute", () => {
    container.innerHTML = `<button data-test-submit-btn>Submit</button>`;
    const el = container.querySelector("button")!;
    expect(detector.perform(el, document)).toBe("page.locator('[data-test-submit-btn]')");
  });

  it("returns null for an element with no data-test attribute", () => {
    container.innerHTML = `<button aria-label="Close">X</button>`;
    const el = container.querySelector("button")!;
    expect(detector.perform(el, document)).toBeNull();
  });

  it("returns a locator for an input with a data-test attribute", () => {
    container.innerHTML = `<input data-test-search />`;
    const el = container.querySelector("input")!;
    expect(detector.perform(el, document)).toBe("page.locator('[data-test-search]')");
  });

  it("matches data-test-* prefix (not just data-test)", () => {
    container.innerHTML = `<button data-testid="foo">Go</button>`;
    const el = container.querySelector("button")!;
    expect(detector.perform(el, document)).toBe("page.locator('[data-testid]')");
  });
});

describe("Label", () => {
  let container: HTMLDivElement;
  let detector: Label;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    detector = new Label();
  });

  afterEach(() => {
    container.remove();
  });

  it("returns getByLabel for an element with aria-label", () => {
    container.innerHTML = `<button aria-label="Close">X</button>`;
    const el = container.querySelector("button")!;
    expect(detector.perform(el, document)).toBe("page.getByLabel('Close')");
  });

  it("returns getByLabel for an input with an associated label element", () => {
    container.innerHTML = `<label for="q">Query</label><input id="q" />`;
    const el = container.querySelector("input")!;
    expect(detector.perform(el, document)).toBe("page.getByLabel('Query')");
  });

  it("returns null for an element with neither aria-label nor associated label", () => {
    container.innerHTML = `<input class="search-box" />`;
    const el = container.querySelector("input")!;
    expect(detector.perform(el, document)).toBeNull();
  });

  it("returns null for an element with id but no matching label", () => {
    container.innerHTML = `<input id="orphan" />`;
    const el = container.querySelector("input")!;
    expect(detector.perform(el, document)).toBeNull();
  });

  it("prefers aria-label over associated label element", () => {
    container.innerHTML = `<label for="f">From label</label><input id="f" aria-label="From aria" />`;
    const el = container.querySelector("input")!;
    expect(detector.perform(el, document)).toBe("page.getByLabel('From aria')");
  });
});

describe("CssClass", () => {
  let container: HTMLDivElement;
  let detector: CssClass;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    detector = new CssClass();
  });

  afterEach(() => {
    container.remove();
  });

  it("returns a locator for an element with a single class", () => {
    container.innerHTML = `<button class="reset-email">Forgot?</button>`;
    const el = container.querySelector("button")!;
    expect(detector.perform(el, document)).toBe("page.locator('.reset-email')");
  });

  it("uses first two classes when element has multiple classes", () => {
    container.innerHTML = `<button class="btn btn-primary extra">Go</button>`;
    const el = container.querySelector("button")!;
    expect(detector.perform(el, document)).toBe("page.locator('.btn.btn-primary')");
  });

  it("returns null for an element with no class", () => {
    container.innerHTML = `<button>Go</button>`;
    const el = container.querySelector("button")!;
    expect(detector.perform(el, document)).toBeNull();
  });

  it("returns null for an element with whitespace-only class", () => {
    container.innerHTML = `<button class="   ">Go</button>`;
    const el = container.querySelector("button")!;
    expect(detector.perform(el, document)).toBeNull();
  });
});

describe("Placeholder", () => {
  let container: HTMLDivElement;
  let detector: Placeholder;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    detector = new Placeholder();
  });

  afterEach(() => {
    container.remove();
  });

  it("returns getByPlaceholder for an input with a long enough placeholder", () => {
    container.innerHTML = `<input placeholder="Enter name" />`;
    const el = container.querySelector("input")!;
    expect(detector.perform(el, document)).toBe("page.getByPlaceholder('Enter name')");
  });

  it("returns getByPlaceholder for a textarea with a placeholder", () => {
    container.innerHTML = `<textarea placeholder="Write here"></textarea>`;
    const el = container.querySelector("textarea")!;
    expect(detector.perform(el, document)).toBe("page.getByPlaceholder('Write here')");
  });

  it("returns null for a placeholder that is too short (3 chars or fewer)", () => {
    container.innerHTML = `<input placeholder="Hi" />`;
    const el = container.querySelector("input")!;
    expect(detector.perform(el, document)).toBeNull();
  });

  it("returns null for an element with no placeholder", () => {
    container.innerHTML = `<input class="search-box" />`;
    const el = container.querySelector("input")!;
    expect(detector.perform(el, document)).toBeNull();
  });
});

describe("Role", () => {
  let container: HTMLDivElement;
  let detector: Role;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    detector = new Role();
  });

  afterEach(() => {
    container.remove();
  });

  it("returns getByRole using the implicit role of a button element", () => {
    container.innerHTML = `<button>Submit</button>`;
    const el = container.querySelector("button")!;
    expect(detector.perform(el, document)).toBe("page.getByRole('button', { name: 'Submit' })");
  });

  it("returns getByRole using an explicit role attribute", () => {
    container.innerHTML = `<div role="dialog">Open settings</div>`;
    const el = container.querySelector("div")!;
    expect(detector.perform(el, document)).toBe(
      "page.getByRole('dialog', { name: 'Open settings' })",
    );
  });

  it("uses an explicit role attribute over the implicit tag role", () => {
    container.innerHTML = `<button role="menuitem">File</button>`;
    const el = container.querySelector("button")!;
    expect(detector.perform(el, document)).toBe("page.getByRole('menuitem', { name: 'File' })");
  });

  it("returns getByRole for an anchor element", () => {
    container.innerHTML = `<a href="#">Go home</a>`;
    const el = container.querySelector("a")!;
    expect(detector.perform(el, document)).toBe("page.getByRole('link', { name: 'Go home' })");
  });

  it("returns null when text content is too short (3 chars or fewer)", () => {
    container.innerHTML = `<button>OK</button>`;
    const el = container.querySelector("button")!;
    expect(detector.perform(el, document)).toBeNull();
  });

  it("returns null when there is no text content", () => {
    container.innerHTML = `<button></button>`;
    const el = container.querySelector("button")!;
    expect(detector.perform(el, document)).toBeNull();
  });

  it("returns null for an element with no implicit or explicit role", () => {
    container.innerHTML = `<span>Some text here</span>`;
    const el = container.querySelector("span")!;
    expect(detector.perform(el, document)).toBeNull();
  });
});

describe("Detectors factory", () => {
  it("getAll() returns 5 instances in order", () => {
    const factory = new Detectors();
    const all = factory.getAll();
    expect(all).toHaveLength(5);
  });

  it("each instance has a non-empty description", () => {
    const factory = new Detectors();
    factory.getAll().forEach((d) => {
      expect(d.description.length).toBeGreaterThan(0);
    });
  });

  it("getByName returns a DataTest instance for 'dataTest'", () => {
    const factory = new Detectors();
    expect(factory.getByName("dataTest")).toBeInstanceOf(DataTest);
  });

  it("getByName returns NullDetector for unknown key", () => {
    const factory = new Detectors();
    const d = factory.getByName("unknown");
    expect(d).toBeInstanceOf(NullDetector);
    expect(d.perform(document.createElement("button"), document)).toBeNull();
  });
});
