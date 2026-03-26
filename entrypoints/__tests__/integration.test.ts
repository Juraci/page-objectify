import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createSidePanel } from "../content";

describe("analyzes the page elements and prints the locators", () => {
  let page: HTMLDivElement;

  describe("buttons", () => {
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

    it("clicking analyze returns the detected elements", () => {
      const panel = createSidePanel();
      panel.shadowRoot!.querySelector<HTMLButtonElement>("#analyze-btn")!.click();

      expect(
        panel.shadowRoot!.querySelector<HTMLDivElement>("#message-area")!.textContent,
      ).toContain("page.locator('[data-test-login-btn]')");
      expect(
        panel.shadowRoot!.querySelector<HTMLDivElement>("#message-area")!.textContent,
      ).toContain("page.getByLabel('Cancel')");
    });
  });
});
