import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Inputs from "../content/collections/inputs";

describe("Inputs", () => {
  let container: HTMLDivElement;
  let inputs: Inputs;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    inputs = new Inputs();
  });

  afterEach(() => {
    container.remove();
  });

  it("returns a locator for an input with a data-test attribute", () => {
    container.innerHTML = `<input data-test-search />`;
    expect(inputs.get()).toStrictEqual(["page.locator('[data-test-search]')"]);
  });

  it("returns a locator for an input with a class", () => {
    container.innerHTML = `<input class="search-box" />`;
    expect(inputs.get()).toStrictEqual(["page.locator('.search-box')"]);
  });

  it("returns a getByLabel locator for an input with aria-label", () => {
    container.innerHTML = `<input aria-label="Search" />`;
    expect(inputs.get()).toStrictEqual(["page.getByLabel('Search')"]);
  });

  it("returns a getByLabel locator for an input with an associated label element", () => {
    container.innerHTML = `<label for="q">Query</label><input id="q" />`;
    expect(inputs.get()).toStrictEqual(["page.getByLabel('Query')"]);
  });

  it("returns a locator for an input with a type attribute", () => {
    container.innerHTML = `<input type="email" />`;
    expect(inputs.get()).toStrictEqual(['page.locator(\'input[type="email"]\')']);
  });

  it("returns a getByPlaceholder locator for an input with a placeholder", () => {
    container.innerHTML = `<input placeholder="Enter name" />`;
    expect(inputs.get()).toStrictEqual(["page.getByPlaceholder('Enter name')"]);
  });

  it("returns a locator for a textarea with a class", () => {
    container.innerHTML = `<textarea class="notes"></textarea>`;
    expect(inputs.get()).toStrictEqual(["page.locator('.notes')"]);
  });

  it("returns a getByPlaceholder locator for a textarea with a placeholder", () => {
    container.innerHTML = `<textarea placeholder="Write here"></textarea>`;
    expect(inputs.get()).toStrictEqual(["page.getByPlaceholder('Write here')"]);
  });

  it("highlights the input when a locator is generated", () => {
    container.innerHTML = `<input data-test-x />`;
    const input = container.querySelector("input") as HTMLElement;
    inputs.get();
    expect(input.style.boxShadow).toBe("0 0 15px rgba(81, 250, 200, 1)");
    expect(input.style.border).toBe("1px solid rgba(81, 250, 200, 1)");
  });

  it("deduplicates inputs that share the same data-test attribute", () => {
    container.innerHTML = `
      <input data-test-x />
      <input data-test-x />
    `;
    expect(inputs.get()).toStrictEqual(["page.locator('[data-test-x]')"]);
  });

  it("skips input[type='hidden']", () => {
    container.innerHTML = `<input type="hidden" />`;
    expect(inputs.get()).toStrictEqual([]);
  });

  it("skips an input with no recognized attributes", () => {
    container.innerHTML = `<input />`;
    expect(inputs.get()).toStrictEqual([]);
  });

  it("returns empty array when there are no inputs", () => {
    expect(inputs.get()).toStrictEqual([]);
  });
});
