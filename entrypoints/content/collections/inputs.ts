import { shine } from "./shine";

export default class Inputs {
  private minimumValueLength = 3;
  private result: string[] = [];
  private seen = new Set<string>();

  get(): string[] {
    const elements = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input:not([type="hidden"]), textarea',
    );
    elements.forEach((el) => {
      const locator = this.resolveLocator(el);
      if (!locator) return;
      shine(el);
      if (this.seen.has(locator)) return;
      this.seen.add(locator);
      this.result.push(locator);
    });
    return this.result;
  }

  private resolveLocator(el: HTMLInputElement | HTMLTextAreaElement): string | null {
    // 1. data-test* attribute
    const dataAttr = el.getAttributeNames().find((n) => n.startsWith("data-test"));
    if (dataAttr) return `page.locator('[${dataAttr}]')`;

    // 2. class
    if (el.className.trim()) {
      const classes = el.className.trim().split(/\s+/).slice(0, 2).join(".");
      return `page.locator('.${classes}')`;
    }

    // 3. label (aria-label or associated <label>)
    const ariaLabel = el.getAttribute("aria-label");
    if (ariaLabel) return `page.getByLabel('${ariaLabel}')`;
    const id = el.getAttribute("id");
    if (id) {
      const label = document.querySelector<HTMLLabelElement>(`label[for="${id}"]`);
      if (label?.textContent?.trim()) return `page.getByLabel('${label.textContent.trim()}')`;
    }

    // 4. type (inputs only, skip textarea which has no type)
    if (el.tagName === "INPUT") {
      const type = (el as HTMLInputElement).type;
      if (type && type !== "text") return `page.locator('input[type="${type}"]')`;
    }

    // 5. placeholder
    const placeholder = el.getAttribute("placeholder");
    if (placeholder && placeholder.trim().length > this.minimumValueLength) {
      return `page.getByPlaceholder('${placeholder.trim()}')`;
    }

    return null;
  }
}
