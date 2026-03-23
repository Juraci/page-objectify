import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createBanner, injectBanner } from "../content";

describe("createBanner", () => {
  it("creates a div with the correct id", () => {
    expect(createBanner().id).toBe("page-objectify-banner");
  });

  it("contains the expected text", () => {
    expect(createBanner().textContent).toBe("Hello World — Page Objectify");
  });

  it("has fixed position", () => {
    expect(createBanner().style.position).toBe("fixed");
  });

  it("does not attach itself to the document", () => {
    expect(document.contains(createBanner())).toBe(false);
  });
});

describe("injectBanner", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("injects the banner into the provided root", () => {
    injectBanner(container);
    expect(container.querySelector("#page-objectify-banner")).not.toBeNull();
  });

  it("prepends the banner as the first child", () => {
    container.appendChild(document.createElement("p"));
    injectBanner(container);
    expect(container.firstElementChild?.id).toBe("page-objectify-banner");
  });

  it("is idempotent — no duplicate on second call", () => {
    injectBanner(container);
    injectBanner(container);
    expect(container.querySelectorAll("#page-objectify-banner")).toHaveLength(1);
  });

  it("returns the same element on repeated calls", () => {
    expect(injectBanner(container)).toBe(injectBanner(container));
  });
});
