import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createSidePanel } from "../content";

describe("analyzes the page elements and prints the locators", () => {
  let page: HTMLDivElement;

  describe("when there are unique elements", () => {
    beforeEach(() => {
      page = document.createElement("div");
      page.innerHTML = `
        <form>
          <input type="text" name="username" placeholder="Username" />
          <input type="password" name="password" placeholder="Password" />
          <button type="submit" data-test-login-btn>Login</button>
          <button type="button" aria-label="Cancel">Cancel</button>
        </form>
      `;
      document.body.appendChild(page);
    });

    afterEach(() => {
      page.remove();
    });

    it("returns the detected elements after clicking analyze page", () => {
      const panel = createSidePanel();
      panel.shadowRoot!.querySelector<HTMLButtonElement>("#analyze-btn")!.click();

      const messageArea = panel.shadowRoot!.querySelector<HTMLDivElement>("#message-area")!;

      expect(messageArea.textContent).toContain("page.locator('[data-test-login-btn]')");
      expect(messageArea.textContent).toContain("page.getByLabel('Cancel')");

      expect(panel.shadowRoot!.querySelector("#copy-btn")).not.toBeNull();
    });
  });

  describe("when there are multiple elements with the same selector", () => {
    beforeEach(() => {
      page = document.createElement("div");
      page.innerHTML = `
        <button data-test-btn>Button</button>
        <button data-test-btn>Button</button>
      `;
      document.body.appendChild(page);
    });

    afterEach(() => {
      page.remove();
    });

    it("returns the selector only once after clicking analyze page", () => {
      const panel = createSidePanel();
      panel.shadowRoot!.querySelector<HTMLButtonElement>("#analyze-btn")!.click();

      const messageArea = panel.shadowRoot!.querySelector<HTMLDivElement>("#message-area")!;

      expect(messageArea.textContent).toContain("page.locator('[data-test-btn]')");
      expect(messageArea.textContent).not.toContain(
        "page.locator('[data-test-btn]')\npage.locator('[data-test-btn]')",
      );
    });
  });
});
