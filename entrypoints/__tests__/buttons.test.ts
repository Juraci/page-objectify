import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Buttons from "../content/collections/buttons";

describe("Buttons", () => {
  let container: HTMLDivElement;
  let buttons: Buttons;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    buttons = new Buttons();
  });

  afterEach(() => {
    container.remove();
  });

  it("returns a locator for a button with a data-test attribute", () => {
    container.innerHTML = `<button data-test-submit-btn>Submit</button>`;
    expect(buttons.get()).toStrictEqual(["page.locator('[data-test-submit-btn]')"]);
  });

  it("returns a getByLabel locator for a button with aria-label", () => {
    container.innerHTML = `<button aria-label="Close">X</button>`;
    expect(buttons.get()).toStrictEqual(["page.getByLabel('Close')"]);
  });

  it("deduplicates buttons that share the same data-test attribute", () => {
    container.innerHTML = `
      <button data-test-btn>First</button>
      <button data-test-btn>Second</button>
    `;
    expect(buttons.get()).toStrictEqual(["page.locator('[data-test-btn]')"]);
  });

  it("returns empty array when there are no buttons", () => {
    expect(buttons.get()).toStrictEqual([]);
  });
});
