<template>
  <div id="results-container" :class="{ 'has-results': lines.length > 0 }">
    <div id="results-toolbar">
      <button id="copy-btn" :class="{ copied: isCopied }" @click="copyToClipboard">
        {{ isCopied ? "Copied!" : "Copy" }}
      </button>
    </div>
    <div v-if="props.lines.length" id="message-area" v-html="highlighted"></div>
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
