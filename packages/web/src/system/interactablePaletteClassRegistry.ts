type VarsMap = Record<string, string | number>;

let styleElement: HTMLStyleElement | null = null;
const keyToClassName = new Map<string, string>();
const insertedRules = new Set<string>();

// Returns a shared <style> element where palette rules are registered. Created
// on-demand and reused across calls. No-op on the server.
function getStyleElement(): HTMLStyleElement | null {
  if (typeof document === 'undefined') return null; // SSR-safe: no DOM
  if (styleElement) return styleElement;
  const el = document.createElement('style');
  el.setAttribute('data-cds-interactable-palettes', 'vars');
  document.head.appendChild(el);
  styleElement = el;
  return styleElement;
}

// Lightweight deterministic hash for stable, short class names based on the
// serialized variables map.
function hashString(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

/**
 * Returns a class name that defines the provided custom properties for
 * Interactable. If an identical variables map was seen before, returns the
 * previously registered class without creating a new rule.
 *
 * Inputs:
 * - `vars`: map of CSS custom properties to literal values (string or number).
 *   Example: { '--interactable-background': 'var(--color-bgPrimary)', '--interactable-hovered-opacity': 0.12 }
 *
 * Behavior:
 * - Inserts a single CSS rule into a shared <style> once per unique map.
 * - Uses CSSOM `insertRule` when available; falls back to text node append.
 * - Returns the generated class name (e.g., `iv-ab12cd`).
 */
export function getInteractablePaletteClass(vars: Record<string, string | number>): string {
  const key = JSON.stringify(vars);
  const cached = keyToClassName.get(key);
  if (cached) return cached;

  const className = `iv-${hashString(key)}`;
  keyToClassName.set(key, className);

  const declarations = Object.entries(vars as VarsMap)
    .map(([prop, value]) => `${prop}:${String(value)};`)
    .join('');

  const cssRule = `.${className}{${declarations}}`;

  const el = getStyleElement();
  if (el && !insertedRules.has(cssRule)) {
    const sheet = el.sheet as CSSStyleSheet | null;
    if (sheet && 'insertRule' in sheet) {
      sheet.insertRule(cssRule, sheet.cssRules.length);
    } else {
      el.appendChild(document.createTextNode(cssRule));
    }
    insertedRules.add(cssRule);
  }

  return className;
}
