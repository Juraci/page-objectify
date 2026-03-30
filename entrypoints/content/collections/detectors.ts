export type Detector = (el: HTMLElement, document: Document) => string | null;

export const detectDataTest: Detector = (el) => {
  const attr = el.getAttributeNames().find((n) => n.startsWith("data-test"));
  return attr ? `page.locator('[${attr}]')` : null;
};

export const detectLabel: Detector = (el, document) => {
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel) return `page.getByLabel('${ariaLabel}')`;
  const id = el.getAttribute("id");
  if (id) {
    const label = document.querySelector<HTMLLabelElement>(`label[for="${id}"]`);
    if (label?.textContent?.trim()) return `page.getByLabel('${label.textContent.trim()}')`;
  }
  return null;
};

export const detectClass: Detector = (el) => {
  const trimmed = el.className.trim();
  if (!trimmed) return null;
  const classes = trimmed.split(/\s+/).slice(0, 2).join(".");
  return `page.locator('.${classes}')`;
};

export const detectPlaceholder: Detector = (el) => {
  const p = el.getAttribute("placeholder");
  return p && p.trim().length > 3 ? `page.getByPlaceholder('${p.trim()}')` : null;
};

const IMPLICIT_ROLES: Record<string, string> = {
  button: "button",
  a: "link",
};

export const detectRole: Detector = (el) => {
  const role = el.getAttribute("role") ?? IMPLICIT_ROLES[el.tagName.toLowerCase()];
  if (!role) return null;
  const text = el.textContent?.trim();
  if (!text || text.length <= 3) return null;
  return `page.getByRole('${role}', { name: '${text}' })`;
};
