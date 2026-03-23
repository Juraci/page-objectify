import { defineContentScript } from "wxt/utils/define-content-script";

// Named exports — imported directly by tests (never via defineContentScript wrapper)

export function createBanner(): HTMLDivElement {
  const banner = document.createElement("div");
  banner.id = "page-objectify-banner";
  banner.textContent = "Hello World — Page Objectify";

  Object.assign(banner.style, {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    zIndex: "2147483647",
    padding: "10px 16px",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    fontFamily: "system-ui, sans-serif",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  });

  return banner;
}

export function injectBanner(root: HTMLElement = document.body): HTMLDivElement {
  const existing = root.querySelector<HTMLDivElement>("#page-objectify-banner");
  if (existing) return existing;

  const banner = createBanner();
  root.prepend(banner);
  return banner;
}

// WXT entrypoint — matches declared here, not in wxt.config.ts

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_end",
  main() {
    injectBanner();
  },
});
