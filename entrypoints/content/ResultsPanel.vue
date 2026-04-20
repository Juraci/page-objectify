<template>
  <div class="results-container" :class="{ 'has-results': lines.length > 0 }">
    <div class="results-toolbar">
      <button class="btn-copy" :class="{ copied: isCopied }" @click="copyToClipboard">
        {{ isCopied ? "Copied!" : "Copy" }}
      </button>
    </div>
    <div v-if="props.lines.length" class="message-area" v-html="highlighted"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { highlightLocators } from "./highlighter";

const props = defineProps<{ lines: string[] }>();

const isCopied = ref(false);

const highlighted = computed(() => highlightLocators(props.lines));

function copyToClipboard() {
  void navigator.clipboard.writeText(props.lines.join("\n")).then(() => {
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 1500);
  });
}
</script>

<style>
@import "./variables.css";

.results-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.results-toolbar {
  display: none;
  justify-content: flex-end;
  margin-bottom: 4px;
}

.results-container.has-results .results-toolbar {
  display: flex;
}

.message-area {
  flex: 1;
  overflow-y: auto;
}

.btn-copy {
  padding: 4px 10px;
  background-color: var(--color-bg-muted);
  color: var(--color-text);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-copy:hover {
  background-color: var(--color-bg-hover);
}
.btn-copy.copied {
  background-color: var(--color-success);
  color: var(--color-bg);
}

.code-block {
  background-color: var(--color-bg-code);
  border: 1px solid var(--color-bg-muted);
  border-radius: 6px;
  padding: 12px 16px;
  margin: 0;
  overflow-x: auto;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre;
  color: var(--color-text-muted);
}

.code-block code {
  display: block;
}

.hl-object {
  color: var(--color-accent);
}
.hl-dot {
  color: var(--color-accent);
}
.hl-method {
  color: var(--color-accent-bright);
}
.hl-paren {
  color: var(--color-text);
}
.hl-string {
  color: var(--color-success);
}
.hl-plain {
  color: var(--color-text-muted);
}
</style>
