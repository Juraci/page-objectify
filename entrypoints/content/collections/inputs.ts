import { shine } from "./shine";
import { type Detector } from "./detectors";

export default class Inputs {
  private result: string[] = [];
  private seen = new Set<string>();

  constructor(private detectors: Detector[]) {}

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
    for (const detect of this.detectors) {
      const result = detect(el, document);
      if (result) return result;
    }
    return null;
  }
}
