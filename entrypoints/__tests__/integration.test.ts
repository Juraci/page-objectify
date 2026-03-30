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
          <button type="button" class="reset-email">Forgot Password?</button>
          <button type="button">Submit</button>
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
      expect(messageArea.textContent).toContain("page.locator('.reset-email')");
      expect(messageArea.textContent).toContain("page.getByRole('button', { name: 'Submit' })");

      expect(panel.shadowRoot!.querySelector("#copy-btn")).not.toBeNull();
    });
  });

  describe("when there are inputs and textareas", () => {
    beforeEach(() => {
      page = document.createElement("div");
      page.innerHTML = `
        <form>
          <input type="text"     data-test-username    placeholder="Username" />
          <input type="email"    class="email-field"   placeholder="Email"    />
          <input type="password" aria-label="Password" placeholder="Password" />
          <input type="text"     placeholder="Search"  />
          <textarea class="notes-field">Notes</textarea>
        </form>
      `;
      document.body.appendChild(page);
    });

    afterEach(() => {
      page.remove();
    });

    it("returns the detected inputs and textareas after clicking analyze page", () => {
      const panel = createSidePanel();
      panel.shadowRoot!.querySelector<HTMLButtonElement>("#analyze-btn")!.click();

      const messageArea = panel.shadowRoot!.querySelector<HTMLDivElement>("#message-area")!;

      expect(messageArea.textContent).toContain("page.locator('[data-test-username]')");
      expect(messageArea.textContent).toContain("page.locator('.email-field')");
      expect(messageArea.textContent).toContain("page.getByLabel('Password')");
      expect(messageArea.textContent).toContain("page.getByPlaceholder('Search')");
      expect(messageArea.textContent).toContain("page.locator('.notes-field')");

      expect(panel.shadowRoot!.querySelector("#copy-btn")).not.toBeNull();
    });
  });

  describe("when there are links", () => {
    beforeEach(() => {
      page = document.createElement("div");
      page.innerHTML = `
        <div>
          <a href="#" data-test-home-link>Home</a>
          <a href="#" class="about-link">About</a>
          <a href="#" aria-label="Contact">Contact</a>
          <a href="#">Login</a>
        </div>
      `;
      document.body.appendChild(page);
    });

    afterEach(() => {
      page.remove();
    });

    it("returns the detected links after clicking analyze page", () => {
      const panel = createSidePanel();
      panel.shadowRoot!.querySelector<HTMLButtonElement>("#analyze-btn")!.click();

      const messageArea = panel.shadowRoot!.querySelector<HTMLDivElement>("#message-area")!;

      expect(messageArea.textContent).toContain("page.locator('[data-test-home-link]')");
      expect(messageArea.textContent).toContain("page.locator('.about-link')");
      expect(messageArea.textContent).toContain("page.getByLabel('Contact')");
      expect(messageArea.textContent).toContain("page.getByRole('link', { name: 'Login' })");

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
