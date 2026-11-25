/** "https://www.prothomalo.com/" → "prothomalo.com" */
export function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Splits a host into the part people remember and its public suffix, so the
 * suffix can be set lighter: "kishoralo.com" → ["kishoralo", ".com"],
 * "nurul.com.bd" → ["nurul", ".com.bd"].
 */
export function splitHost(host: string): [string, string] {
  const twoPart = host.match(/\.(?:com|net|org|edu|gov|ac|co)\.[a-z]{2}$/);
  const i = twoPart?.index ?? host.lastIndexOf(".");
  return i > 0 ? [host.slice(0, i), host.slice(i)] : [host, ""];
}
