<template>
  <div>
    <div class="panel" :class="{ hidden: !isVisible }">
      <div class="panel-header">Page Raptor</div>
      <div class="panel-body">
        <DetectorList ref="detectorList" />
        <button class="btn-analyze" @click="handleAnalyze">Analyze Page</button>
        <ResultsPanel :lines="results" />
      </div>
    </div>
    <button class="btn-toggle" @click="isVisible = !isVisible">
      {{ isVisible ? "❮" : "❯" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DetectorList from "./DetectorList.vue";
import ResultsPanel from "./ResultsPanel.vue";
import Wrapper from "./wrapper";
import Buttons from "./collections/buttons";
import Inputs from "./collections/inputs";
import Links from "./collections/links";

const isVisible = ref(false);
const results = ref<string[]>([]);
const detectorList = ref<InstanceType<typeof DetectorList> | null>(null);

function handleAnalyze() {
  const detectors = detectorList.value?.getActiveDetectors() ?? [];
  const wrapper = new Wrapper([new Inputs(detectors), new Buttons(detectors), new Links(detectors)]);
  results.value = wrapper.scan();
}
</script>

<style>
@import "./variables.css";

.panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: var(--panel-width);
  background-color: var(--color-bg);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.4);
  z-index: 2147483647;
  display: flex;
  flex-direction: column;
  font-family: system-ui, sans-serif;
  font-size: 14px;
  transition: transform 0.3s ease;
}

.panel.hidden {
  transform: translateX(100%);
}

.panel-header {
  padding: 16px;
  background-color: var(--color-bg-raised);
  color: var(--color-text);
  font-weight: 600;
  font-size: 16px;
}

.panel-body {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}

.btn-analyze {
  padding: 8px 16px;
  background-color: var(--color-accent);
  color: var(--color-bg);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  align-self: center;
}

.btn-analyze:hover {
  background-color: var(--color-accent-bright);
}

.btn-toggle {
  position: fixed;
  top: 50%;
  right: var(--panel-width);
  transform: translateY(-50%);
  background-color: var(--color-bg-raised);
  color: var(--color-accent-bright);
  border: none;
  border-radius: 6px 0 0 6px;
  padding: 12px 6px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  z-index: 2147483647;
  transition: right 0.3s ease, background-color 0.15s ease;
}

.btn-toggle:hover {
  background-color: var(--color-bg-hover);
}

.panel.hidden ~ .btn-toggle {
  right: 0;
}
</style>
