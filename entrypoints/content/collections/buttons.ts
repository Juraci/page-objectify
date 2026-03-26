export default class Buttons {
  constructor() {}

  get(): string {
    const result: string[] = [];
    const elements = document.querySelectorAll("button");
    elements.forEach((el) => {
      const dataSelector = el.getAttributeNames().filter((name) => name.startsWith("data-"))[0];
      if (dataSelector) {
        result.push(`page.locator('[${dataSelector}]')`);
      } else if (el.getAttribute("aria-label")) {
        result.push(`page.getByLabel('${el.getAttribute("aria-label")}')`);
      }
    });
    return result.join(", ");
  }
}
