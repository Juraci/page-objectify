import { defineContentScript } from "wxt/utils/define-content-script";
import Buttons from "./collections/buttons";
import Wrapper from "./wrapper";
import { highlightLocators } from "./highlighter";

import panelHtml from "./panel.html?raw";

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

  return host;
}

export function analyze(root: ShadowRoot | Document = document): void {
  const messageArea = root.querySelector<HTMLElement>("#message-area");
  if (!messageArea) return;

  const buttons = new Buttons();
  const wrapper = new Wrapper([buttons]);
  const lines = wrapper.scan().flatMap((s) => s.split(/(?=page\.)/).filter(Boolean));

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
