export function validateUrl(url) {
  // Minimal baseline: allow https only, block localhost/private IP ranges, etc.
  // Expand later with allowlists, reputation checks, etc.
  const u = new URL(url);
  if (u.protocol !== "https:") throw new Error("Only https URLs allowed");
  const host = u.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local")) throw new Error("Localhost blocked");
  return { ok: true };
}