import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ResultsPanel from "../content/ResultsPanel.vue";

describe("ResultsPanel", () => {
  it("renders empty state when no lines", () => {
    const wrapper = mount(ResultsPanel, { props: { lines: [] } });
    expect(wrapper.find("#results-container").classes()).not.toContain("has-results");
    expect(wrapper.find("#message-area").exists()).toBe(false);
  });

  it("shows has-results class when lines are present", () => {
    const wrapper = mount(ResultsPanel, {
      props: { lines: ["page.getByLabel('Email')"] },
    });
    expect(wrapper.find("#results-container").classes()).toContain("has-results");
  });

  it("renders highlighted output in message area", () => {
    const wrapper = mount(ResultsPanel, {
      props: { lines: ["page.getByLabel('Email')"] },
    });
    const html = wrapper.find("#message-area").html();
    expect(html).toContain("hl-method");
    expect(html).toContain("hl-string");
  });

  it("copy button is visible when lines are present", () => {
    const wrapper = mount(ResultsPanel, {
      props: { lines: ["page.getByLabel('Email')"] },
    });
    expect(wrapper.find("#copy-btn").exists()).toBe(true);
  });

  it("copy button writes to clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });
    const lines = ["page.getByLabel('Email')"];
    const wrapper = mount(ResultsPanel, { props: { lines } });
    await wrapper.find("#copy-btn").trigger("click");
    expect(writeText).toHaveBeenCalledWith(lines.join("\n"));
  });
});
