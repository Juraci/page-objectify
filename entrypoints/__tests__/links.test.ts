import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Links from "../content/collections/links";
import { Detectors } from "../content/detectors";

const allDetectors = new Detectors().getAll().map((d) => d.perform);

describe("Links", () => {
  let container: HTMLDivElement;
  let links: Links;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    links = new Links(allDetectors);
  });

  afterEach(() => {
    container.remove();
  });

  it("returns a locator for a link with a data-test attribute", () => {
    container.innerHTML = `<a href="#" data-test-home-link>Home</a>`;
    expect(links.get()).toStrictEqual(["page.locator('[data-test-home-link]')"]);
  });

  it("returns a getByLabel locator for a link with aria-label", () => {
    container.innerHTML = `<a href="#" aria-label="Contact">Contact</a>`;
    expect(links.get()).toStrictEqual(["page.getByLabel('Contact')"]);
  });

  it("returns a locator for a link with a class", () => {
    container.innerHTML = `<a href="#" class="about-link">About</a>`;
    expect(links.get()).toStrictEqual(["page.locator('.about-link')"]);
  });

  it("returns a getByRole locator for a link with text content longer than the minimum length", () => {
    container.innerHTML = `<a href="#">Login</a>`;
    expect(links.get()).toStrictEqual(["page.getByRole('link', { name: 'Login' })"]);
  });

  it("highlights the link when a locator is generated", () => {
    container.innerHTML = `<a href="#" data-test-home-link>Home</a>`;
    const link = container.querySelector("a") as HTMLElement;
    links.get();
    expect(link.style.boxShadow).toBe("0 0 15px rgba(81, 250, 200, 1)");
    expect(link.style.border).toBe("1px solid rgba(81, 250, 200, 1)");
  });

  it("deduplicates links that share the same data-test attribute", () => {
    container.innerHTML = `
      <a href="#" data-test-link>First</a>
      <a href="#" data-test-link>Second</a>
    `;
    expect(links.get()).toStrictEqual(["page.locator('[data-test-link]')"]);
  });

  it("returns empty array when there are no links", () => {
    expect(links.get()).toStrictEqual([]);
  });

  it("skips a link with no recognized attributes", () => {
    container.innerHTML = `<a href="#">Go</a>`;
    expect(links.get()).toStrictEqual([]);
  });
});
