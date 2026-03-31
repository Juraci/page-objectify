import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import type { VueWrapper } from "@vue/test-utils";
import SidePanel from "../content/SidePanel.vue";

async function buildPanel(html: string): Promise<{ wrapper: VueWrapper; page: HTMLDivElement }> {
  const page = document.createElement("div");
  page.innerHTML = html;
  document.body.appendChild(page);

  const wrapper = mount(SidePanel, { attachTo: document.body });
  await wrapper.find(".btn-analyze").trigger("click");
  await nextTick();
  return { wrapper, page };
}

describe("analyzes the page elements and prints the locators", () => {
  let wrapper: VueWrapper;
  let page: HTMLDivElement;

  afterEach(() => {
    page.remove();
    wrapper.unmount();
  });

  describe("when there are unique elements", () => {
    beforeEach(async () => {
      ({ wrapper, page } = await buildPanel(`
        <form>
          <input type="text" name="username" placeholder="Username" />
          <input type="password" name="password" placeholder="Password" />
          <button type="submit" data-test-login-btn>Login</button>
          <button type="button" aria-label="Cancel">Cancel</button>
          <button type="button" class="reset-email">Forgot Password?</button>
          <button type="button">Submit</button>
        </form>
      `));
    });

    it("returns the detected elements after clicking analyze page", () => {
      const text = wrapper.find(".message-area").text();
      expect(text).toContain("page.locator('[data-test-login-btn]')");
      expect(text).toContain("page.getByLabel('Cancel')");
      expect(text).toContain("page.locator('.reset-email')");
      expect(text).toContain("page.getByRole('button', { name: 'Submit' })");
      expect(wrapper.find(".btn-copy").exists()).toBe(true);
    });
  });

  describe("when there are inputs and textareas", () => {
    beforeEach(async () => {
      ({ wrapper, page } = await buildPanel(`
        <form>
          <input type="text"     data-test-username    placeholder="Username" />
          <input type="email"    class="email-field"   placeholder="Email"    />
          <input type="password" aria-label="Password" placeholder="Password" />
          <input type="text"     placeholder="Search"  />
          <textarea class="notes-field">Notes</textarea>
        </form>
      `));
    });

    it("returns the detected inputs and textareas after clicking analyze page", () => {
      const text = wrapper.find(".message-area").text();
      expect(text).toContain("page.locator('[data-test-username]')");
      expect(text).toContain("page.locator('.email-field')");
      expect(text).toContain("page.getByLabel('Password')");
      expect(text).toContain("page.getByPlaceholder('Search')");
      expect(text).toContain("page.locator('.notes-field')");
      expect(wrapper.find(".btn-copy").exists()).toBe(true);
    });
  });

  describe("when there are links", () => {
    beforeEach(async () => {
      ({ wrapper, page } = await buildPanel(`
        <div>
          <a href="#" data-test-home-link>Home</a>
          <a href="#" class="about-link">About</a>
          <a href="#" aria-label="Contact">Contact</a>
          <a href="#">Login</a>
        </div>
      `));
    });

    it("returns the detected links after clicking analyze page", () => {
      const text = wrapper.find(".message-area").text();
      expect(text).toContain("page.locator('[data-test-home-link]')");
      expect(text).toContain("page.locator('.about-link')");
      expect(text).toContain("page.getByLabel('Contact')");
      expect(text).toContain("page.getByRole('link', { name: 'Login' })");
      expect(wrapper.find(".btn-copy").exists()).toBe(true);
    });
  });

  describe("when there are multiple elements with the same selector", () => {
    beforeEach(async () => {
      ({ wrapper, page } = await buildPanel(`
        <button data-test-btn>Button</button>
        <button data-test-btn>Button</button>
      `));
    });

    it("returns the selector only once after clicking analyze page", () => {
      const text = wrapper.find(".message-area").text();
      expect(text).toContain("page.locator('[data-test-btn]')");
      const matches = text.match(/page\.locator\('\[data-test-btn\]'\)/g) ?? [];
      expect(matches).toHaveLength(1);
    });
  });
});
