import { shine } from "./shine";
import { type Detector } from "./detectors";

const MINIMUM_TEXT_LENGTH = 3;

export default class Buttons {
  private result: string[] = [];
  private seen = new Set<string>();

  constructor(private detectors: Detector[]) {}

  get(): string[] {
    const elements = document.querySelectorAll("button");
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

  private resolveLocator(el: HTMLButtonElement): string | null {
    for (const detect of this.detectors) {
      const result = detect(el, document);
      if (result) return result;
    }
    if (el.textContent && el.textContent.trim().length > MINIMUM_TEXT_LENGTH) {
      return `page.getByRole('button', { name: '${el.textContent.trim()}' })`;
    }
    return null;
  }
}
