import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Buttons from "../content/collections/buttons";
import {
  detectDataTest,
  detectLabel,
  detectClass,
  detectPlaceholder,
} from "../content/collections/detectors";

const allDetectors = [detectDataTest, detectLabel, detectClass, detectPlaceholder];

describe("Buttons", () => {
  let container: HTMLDivElement;
  let buttons: Buttons;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    buttons = new Buttons(allDetectors);
  });

  afterEach(() => {
    container.remove();
  });

  it("returns a locator for a button with a data-test attribute", () => {
    container.innerHTML = `<button data-test-submit-btn>Submit</button>`;
    expect(buttons.get()).toStrictEqual(["page.locator('[data-test-submit-btn]')"]);
  });

  it("highlights the button when a locator is generated", () => {
    container.innerHTML = `<button data-test-submit-btn>Submit</button>`;
    const button = container.querySelector("button") as HTMLElement;
    buttons.get();
    expect(button.style.boxShadow).toBe("0 0 15px rgba(81, 250, 200, 1)");
    expect(button.style.border).toBe("1px solid rgba(81, 250, 200, 1)");
  });

  it("returns a getByLabel locator for a button with aria-label", () => {
    container.innerHTML = `<button aria-label="Close">X</button>`;
    expect(buttons.get()).toStrictEqual(["page.getByLabel('Close')"]);
  });

  it("returns a locator for a button with a class", () => {
    container.innerHTML = `<button class="reset-email">Forgot Password?</button>`;
    expect(buttons.get()).toStrictEqual(["page.locator('.reset-email')"]);
  });

  it("returns a getByRole locator for a button with text content longer than the minimum length", () => {
    container.innerHTML = `<button>Submit</button>`;
    expect(buttons.get()).toStrictEqual(["page.getByRole('button', { name: 'Submit' })"]);
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
