import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SidePanel from "../content/SidePanel.vue";

describe("SidePanel", () => {
  it("renders the panel header", () => {
    const wrapper = mount(SidePanel);
    expect(wrapper.find(".panel-header").text()).toBe("Page Raptor");
  });

  it("renders the analyze button", () => {
    const wrapper = mount(SidePanel);
    expect(wrapper.find(".btn-analyze").exists()).toBe(true);
  });

  it("renders the toggle button", () => {
    const wrapper = mount(SidePanel);
    expect(wrapper.find(".btn-toggle").exists()).toBe(true);
  });

  it("panel is hidden by default", () => {
    const wrapper = mount(SidePanel);
    expect(wrapper.find(".panel").classes()).toContain("hidden");
  });

  it("clicking toggle shows the panel", async () => {
    const wrapper = mount(SidePanel);
    await wrapper.find(".btn-toggle").trigger("click");
    expect(wrapper.find(".panel").classes()).not.toContain("hidden");
  });

  it("clicking analyze produces results when page has elements", async () => {
    const wrapper = mount(SidePanel, { attachTo: document.body });
    const btn = document.createElement("button");
    btn.setAttribute("aria-label", "Submit");
    btn.textContent = "Submit";
    document.body.appendChild(btn);
    await wrapper.find(".btn-analyze").trigger("click");
    expect(wrapper.find(".results-container").classes()).toContain("has-results");
    btn.remove();
    wrapper.unmount();
  });
});
