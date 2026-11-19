import DOMPurify from "dompurify";

/**
 * Sanitise CMS/admin-authored HTML before it is injected with dangerouslySetInnerHTML.
 * Strips scripts, inline event handlers and javascript: URLs (defence in depth —
 * the backend also sanitises on write).
 */
export function safeHtml(html) {
  return { __html: DOMPurify.sanitize(html || "", { USE_PROFILES: { html: true } }) };
}
