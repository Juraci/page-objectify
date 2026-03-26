import { defineContentScript } from "wxt/utils/define-content-script";
import Buttons from "./collections/buttons";
import Wrapper from "./wrapper";

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
  if (messageArea) {
    const buttons = new Buttons();
    const wrapper = new Wrapper([buttons]);
    messageArea.textContent = wrapper.scan().join("\n");
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
