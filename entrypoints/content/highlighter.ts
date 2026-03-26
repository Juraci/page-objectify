function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Matches: page.methodName('string arg') or page.methodName("string arg")
const TOKEN_RE = /^(page)(\.)([\w]+)(\()('[^']*'|"[^"]*")(\))$/;

function highlightLine(line: string): string {
  const trimmed = line.trim();
  const m = trimmed.match(TOKEN_RE);
  if (!m) return `<span class="hl-plain">${escapeHtml(trimmed)}</span>`;
  const [, obj, dot, method, open, str, close] = m;
  return (
    `<span class="hl-object">${escapeHtml(obj)}</span>` +
    `<span class="hl-dot">${dot}</span>` +
    `<span class="hl-method">${escapeHtml(method)}</span>` +
    `<span class="hl-paren">${open}</span>` +
    `<span class="hl-string">${escapeHtml(str)}</span>` +
    `<span class="hl-paren">${close}</span>`
  );
}

export function highlightLocators(lines: string[]): string {
  const body = lines.map(highlightLine).join("\n");
  return `<pre class="code-block"><code>${body}</code></pre>`;
}
