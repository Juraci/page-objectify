import { shine } from "./shine";

export default class Buttons {
  private minimumValueLength: number = 3;
  private result: string[];
  private seen: Set<string>;

  constructor() {
    this.result = [];
    this.seen = new Set<string>();
  }

  get(): string[] {
    const elements = document.querySelectorAll("button");
    elements.forEach((el) => {
      const dataSelector = el.getAttributeNames().filter((name) => name.startsWith("data-test"))[0];
      let locator: string | null = null;
      if (dataSelector) {
        locator = `page.locator('[${dataSelector}]')`;
      } else if (el.className) {
        locator = `page.locator('.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}')`;
      } else if (el.getAttribute("aria-label")) {
        locator = `page.getByLabel('${el.getAttribute("aria-label")}')`;
      } else if (el.textContent && el.textContent.trim().length > this.minimumValueLength) {
        locator = `page.getByRole('button', { name: '${el.textContent.trim()}' })`;
      }
      if (!locator) return;

      shine(el);

      if (this.seen.has(locator)) return;

      this.seen.add(locator);
      this.result.push(locator);
    });
    return this.result;
  }
}
