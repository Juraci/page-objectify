import { describe, it, expect } from "vitest";
import { highlightLocators } from "../content/highlighter";

describe("highlightLocators", () => {
  it("wraps a known locator line with the correct token spans", () => {
    const result = highlightLocators(["page.locator('[data-test-id]')"]);
    expect(result).toContain('<span class="hl-object">page</span>');
    expect(result).toContain('<span class="hl-method">locator</span>');
    expect(result).toContain('<span class="hl-string">&#39;[data-test-id]&#39;</span>');
  });

  it("entity-escapes single quotes inside the string argument", () => {
    const result = highlightLocators(["page.getByLabel('Cancel')"]);
    expect(result).toContain("&#39;Cancel&#39;");
    expect(result).not.toContain("'Cancel'");
  });

  it("wraps unrecognized lines in hl-plain span", () => {
    const result = highlightLocators(["some unrecognized text"]);
    expect(result).toContain('<span class="hl-plain">some unrecognized text</span>');
  });

  it("does not emit a literal <script> tag for XSS input", () => {
    const result = highlightLocators(["<script>alert(1)</script>"]);
    expect(result).not.toContain("<script>");
    expect(result).toContain("&lt;script&gt;");
  });

  it("returns an empty pre/code block for an empty array", () => {
    const result = highlightLocators([]);
    expect(result).toBe('<pre class="code-block"><code></code></pre>');
  });

  it("joins multiple lines with newlines", () => {
    const result = highlightLocators(["page.locator('[data-a]')", "page.getByLabel('Cancel')"]);
    const code = result.match(/<code>([\s\S]*)<\/code>/)![1];
    expect(code.split("\n")).toHaveLength(2);
  });

  it("highlights lines that have trailing whitespace", () => {
    const result = highlightLocators([
      "page.locator('[data-v-2be61601]') ",
      "page.locator('[data-test-gpt-attachment-button-label]') ",
      "page.getByLabel('Dismiss attachment tip') ",
      "page.locator('[data-test-clinical-research-toggle]')",
    ]);
    const methods = result.match(/class="hl-method"/g) ?? [];
    expect(methods).toHaveLength(4);
  });
});
