import { defineConfig } from "wxt";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  vite: () => ({ plugins: [vue()] }),
  manifest: {
    permissions: [],
  },
  zip: {
    artifactTemplate: "{{name}}-v{{version}}.zip",
  },
});
