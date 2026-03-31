import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import DetectorList from "../content/DetectorList.vue";
import { Detectors } from "../content/detectors/index";

describe("DetectorList", () => {
  it("renders all detectors", async () => {
    const wrapper = mount(DetectorList);
    await nextTick();
    const items = wrapper.findAll(".detector-item");
    expect(items).toHaveLength(new Detectors().getAll().length);
  });

  it("all detectors are enabled by default", async () => {
    const wrapper = mount(DetectorList);
    await nextTick();
    const checkboxes = wrapper.findAll<HTMLInputElement>("input[type='checkbox']");
    checkboxes.forEach((cb) => expect((cb.element as HTMLInputElement).checked).toBe(true));
  });

  it("unchecking a detector removes it from getActiveDetectors", async () => {
    const wrapper = mount(DetectorList);
    await nextTick();
    const allCount = new Detectors().getAll().length;
    const firstCheckbox = wrapper.find<HTMLInputElement>("input[type='checkbox']");
    await firstCheckbox.setValue(false);
    const active = (
      wrapper.vm as unknown as { getActiveDetectors: () => unknown[] }
    ).getActiveDetectors();
    expect(active).toHaveLength(allCount - 1);
  });

  it("getActiveDetectors returns Detector functions", async () => {
    const wrapper = mount(DetectorList);
    await nextTick();
    const active = (
      wrapper.vm as unknown as { getActiveDetectors: () => unknown[] }
    ).getActiveDetectors();
    expect(active.length).toBeGreaterThan(0);
    active.forEach((d) => expect(typeof d).toBe("function"));
  });
});
