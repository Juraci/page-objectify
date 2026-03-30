import { defineContentScript } from "wxt/utils/define-content-script";
import Buttons from "./collections/buttons";
import Inputs from "./collections/inputs";
import Links from "./collections/links";
import Wrapper from "./wrapper";
import { highlightLocators } from "./highlighter";
import { Detectors, NullDetector, type Detector } from "./detectors";

import panelHtml from "./panel.html?raw";

function buildDetectors(root: ShadowRoot | Document, factory: Detectors): Detector[] {
  const list = root.querySelector<HTMLUListElement>("#detector-list");
  if (!list) return factory.getAll().map((d) => d.perform);
  const result: Detector[] = [];
  list.querySelectorAll<HTMLLIElement>(".detector-item").forEach((item) => {
    const key = item.dataset.detector;
    const cb = item.querySelector<HTMLInputElement>("input[type='checkbox']");
    if (!key || !cb?.checked) return;
    const d = factory.getByName(key);
    if (!(d instanceof NullDetector)) result.push(d.perform);
  });
  return result;
}

function attachDragHandlers(shadow: ShadowRoot): void {
  const list = shadow.querySelector<HTMLUListElement>("#detector-list");
  if (!list) return;
  let dragged: HTMLElement | null = null;

  list.addEventListener("dragstart", (e) => {
    dragged = (e.target as HTMLElement).closest(".detector-item");
    dragged?.classList.add("dragging");
  });

  list.addEventListener("dragend", () => {
    dragged?.classList.remove("dragging");
    dragged = null;
  });

  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!dragged) return;
    const target = (e.target as HTMLElement).closest<HTMLElement>(".detector-item");
    if (!target || target === dragged) return;
    const rect = target.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    if (e.clientY < mid) {
      list.insertBefore(dragged, target);
    } else {
      list.insertBefore(dragged, target.nextSibling);
    }
  });
}

// Named exports — imported directly by tests (never via defineContentScript wrapper)

export function createSidePanel(): HTMLDivElement {
  const host = document.createElement("div");
  host.id = "page-objectify-panel-host";

  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = panelHtml;

  const btn = shadow.querySelector<HTMLButtonElement>("#analyze-btn");
  btn?.addEventListener("click", () => analyze(shadow));

  const toggleBtn = shadow.querySelector<HTMLButtonElement>("#toggle-btn");
  const panel = shadow.querySelector<HTMLDivElement>(".panel");
  toggleBtn?.addEventListener("click", () => {
    const hidden = panel?.classList.toggle("hidden");
    if (toggleBtn) toggleBtn.textContent = hidden ? "❯" : "❮";
  });

  attachDragHandlers(shadow);

  const allDetectors = new Detectors();
  const list = shadow.querySelector<HTMLUListElement>("#detector-list")!;
  allDetectors.getAll().forEach((d) => {
    const li = shadow.ownerDocument.createElement("li");
    li.className = "detector-item";
    li.draggable = true;
    li.dataset.detector = d.name;
    li.innerHTML =
      `<span class="drag-handle">⠿</span>` +
      `<label><input type="checkbox" checked /> ${d.description}</label>`;
    list.appendChild(li);
  });

  return host;
}

export function analyze(root: ShadowRoot | Document = document): void {
  const messageArea = root.querySelector<HTMLElement>("#message-area");
  if (!messageArea) return;

  const detectors = buildDetectors(root, new Detectors());
  const wrapper = new Wrapper([new Inputs(detectors), new Buttons(detectors), new Links(detectors)]);
  const lines = wrapper.scan();

  messageArea.innerHTML = highlightLocators(lines);

  const container = root.querySelector<HTMLElement>("#results-container");
  container?.classList.toggle("has-results", lines.length > 0);

  const copyBtn = root.querySelector<HTMLButtonElement>("#copy-btn");
  if (copyBtn) {
    const fresh = copyBtn.cloneNode(true) as HTMLButtonElement;
    copyBtn.replaceWith(fresh);
    fresh.addEventListener("click", () => {
      void navigator.clipboard.writeText(lines.join("\n")).then(() => {
        fresh.textContent = "Copied!";
        fresh.classList.add("copied");
        setTimeout(() => {
          fresh.textContent = "Copy";
          fresh.classList.remove("copied");
        }, 1500);
      });
    });
  }
}

export function injectSidePanel(root: HTMLElement = document.body): HTMLDivElement {
  const existing = root.querySelector<HTMLDivElement>("#page-objectify-panel-host");
  if (existing) return existing;

  const panel = createSidePanel();
  root.appendChild(panel);
  return panel;
}

// WXT entrypoint — matches declared here, not in wxt.config.ts

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_end",
  main() {
    injectSidePanel();
  },
});
