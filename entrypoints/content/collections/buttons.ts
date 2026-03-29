export default class Buttons {
  constructor() {}

  get(): string[] {
    const seen = new Set<string>();
    const result: string[] = [];
    const elements = document.querySelectorAll("button");
    elements.forEach((el) => {
      const dataSelector = el.getAttributeNames().filter((name) => name.startsWith("data-test"))[0];
      let locator: string | null = null;
      if (dataSelector) {
        locator = `page.locator('[${dataSelector}]')`;
      } else if (el.getAttribute("aria-label")) {
        locator = `page.getByLabel('${el.getAttribute("aria-label")}')`;
      }
      if (locator && !seen.has(locator)) {
        seen.add(locator);
        result.push(locator);
      }
    });
    return result;
  }
}
