/** Stored links are free text: allow only web and mail links, so `javascript:` can never reach an href. */
export function safeExternalHref(url: string): string | undefined {
  const trimmed = url.trim();
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const { protocol } = new URL(withScheme);
    return protocol === "http:" || protocol === "https:" || protocol === "mailto:" ? withScheme : undefined;
  } catch {
    return undefined;
  }
}
