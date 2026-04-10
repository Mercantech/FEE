/** Base64URL JWT payload (uden signaturvalidering) — virker i Edge og Node. */
export function decodeJwtPayload(token: string): Record<string, unknown> {
  const parts = token.split(".");
  if (parts.length < 2) throw new Error("Ugyldigt JWT");
  let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) base64 += "=".repeat(4 - pad);
  const json = atob(base64);
  return JSON.parse(json) as Record<string, unknown>;
}
