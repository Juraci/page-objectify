export type Detector = (el: HTMLElement, document: Document) => string | null;

export interface DetectorInstance {
  readonly name: string;
  readonly description: string;
  perform: Detector;
}

export class DataTest implements DetectorInstance {
  readonly name = "dataTest";
  readonly description = "data-test attribute";

  perform: Detector = (el) => {
    const attr = el.getAttributeNames().find((n) => n.startsWith("data-test"));
    return attr ? `page.locator('[${attr}]')` : null;
  };
}

export class Label implements DetectorInstance {
  readonly name = "label";
  readonly description = "aria-label / label";

  perform: Detector = (el, document) => {
    const ariaLabel = el.getAttribute("aria-label");
    if (ariaLabel) return `page.getByLabel('${ariaLabel}')`;
    const id = el.getAttribute("id");
    if (id) {
      const label = document.querySelector<HTMLLabelElement>(`label[for="${id}"]`);
      if (label?.textContent?.trim()) return `page.getByLabel('${label.textContent.trim()}')`;
    }
    return null;
  };
}

export class CssClass implements DetectorInstance {
  readonly name = "class";
  readonly description = "CSS class";

  perform: Detector = (el) => {
    const trimmed = el.className.trim();
    if (!trimmed) return null;
    const classes = trimmed.split(/\s+/).slice(0, 2).join(".");
    return `page.locator('.${classes}')`;
  };
}

export class Placeholder implements DetectorInstance {
  readonly name = "placeholder";
  readonly description = "placeholder";

  perform: Detector = (el) => {
    const p = el.getAttribute("placeholder");
    return p && p.trim().length > 3 ? `page.getByPlaceholder('${p.trim()}')` : null;
  };
}

const IMPLICIT_ROLES: Record<string, string> = {
  button: "button",
  a: "link",
};

export class Role implements DetectorInstance {
  readonly name = "role";
  readonly description = "role / text content";

  perform: Detector = (el) => {
    const role = el.getAttribute("role") ?? IMPLICIT_ROLES[el.tagName.toLowerCase()];
    if (!role) return null;
    const text = el.textContent?.trim();
    if (!text || text.length <= 3) return null;
    return `page.getByRole('${role}', { name: '${text}' })`;
  };
}

export class NullDetector implements DetectorInstance {
  readonly name = "null";
  readonly description = "";

  perform: Detector = () => null;
}

export class Detectors {
  private registry: Record<string, DetectorInstance> = {
    dataTest: new DataTest(),
    label: new Label(),
    class: new CssClass(),
    placeholder: new Placeholder(),
    role: new Role(),
  };

  getAll(): DetectorInstance[] {
    return Object.values(this.registry);
  }

  getByName(name: string): DetectorInstance {
    return this.registry[name] ?? new NullDetector();
  }
}
