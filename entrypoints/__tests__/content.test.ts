import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createSidePanel, injectSidePanel } from "../content";

describe("createSidePanel", () => {
  it("creates a host div with the correct id", () => {
    expect(createSidePanel().id).toBe("page-objectify-panel-host");
  });

  it("attaches an open shadow root", () => {
    expect(createSidePanel().shadowRoot).not.toBeNull();
  });

  it("shadow root contains the analyze button", () => {
    const panel = createSidePanel();
    expect(panel.shadowRoot!.querySelector("#analyze-btn")).not.toBeNull();
  });

  it("shadow root contains the message area", () => {
    const panel = createSidePanel();
    expect(panel.shadowRoot!.querySelector("#message-area")).not.toBeNull();
  });

  it("does not attach itself to the document", () => {
    expect(document.contains(createSidePanel())).toBe(false);
  });
});

describe("injectSidePanel", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("injects the panel into the provided root", () => {
    injectSidePanel(container);
    expect(container.querySelector("#page-objectify-panel-host")).not.toBeNull();
  });

  it("is idempotent — no duplicate on second call", () => {
    injectSidePanel(container);
    injectSidePanel(container);
    expect(container.querySelectorAll("#page-objectify-panel-host")).toHaveLength(1);
  });

  it("returns the same element on repeated calls", () => {
    expect(injectSidePanel(container)).toBe(injectSidePanel(container));
  });
});
