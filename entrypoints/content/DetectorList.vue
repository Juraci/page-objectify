<template>
  <div class="detector-config">
    <div class="config-heading">Detection Priority</div>
    <ul class="detector-list">
      <li
        v-for="(detector, index) in detectors"
        :key="detector.name"
        class="detector-item"
        draggable="true"
        :data-detector="detector.name"
        @dragstart="onDragStart(index)"
        @dragover.prevent="onDragOver(index)"
        @drop="onDrop(index)"
        @dragend="onDragEnd"
      >
        <span class="drag-handle">⠿</span>
        <label>
          <input type="checkbox" v-model="detector.enabled" />
          {{ detector.description }}
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Detectors, type Detector } from "./detectors/index";

interface DetectorItem {
  name: string;
  description: string;
  enabled: boolean;
}

const detectors = ref<DetectorItem[]>([]);
let dragIndex: number | null = null;

onMounted(() => {
  detectors.value = new Detectors().getAll().map((d) => ({
    name: d.name,
    description: d.description,
    enabled: true,
  }));
});

function onDragStart(index: number) {
  dragIndex = index;
}

function onDragOver(index: number) {
  if (dragIndex === null || dragIndex === index) return;
  const items = [...detectors.value];
  const [moved] = items.splice(dragIndex, 1);
  items.splice(index, 0, moved);
  detectors.value = items;
  dragIndex = index;
}

function onDrop(_index: number) {
  dragIndex = null;
}

function onDragEnd() {
  dragIndex = null;
}

function getActiveDetectors(): Detector[] {
  const factory = new Detectors();
  return detectors.value
    .filter((d) => d.enabled)
    .map((d) => factory.getByName(d.name).perform);
}

defineExpose({ getActiveDetectors });
</script>

<style>
@import "./variables.css";

.detector-config {
  /* container for the detector configuration section */
}

.config-heading {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}

.detector-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.detector-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  background-color: var(--color-bg-raised);
  border-radius: 4px;
  user-select: none;
}

.detector-item.drag-over {
  outline: 2px solid var(--color-accent-bright);
}

.drag-handle {
  cursor: grab;
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1;
  flex-shrink: 0;
}

.detector-item label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: var(--color-text);
  font-size: 13px;
}
</style>
