/**
 * Server-only env for both:
 * - `astro dev` — Vite loads `.env` into `import.meta.env`
 * - `npm start` — Node `--env-file=.env` loads into `process.env`
 */
export function requireServerEnv(name: string): string {
  const fromProcess = process.env[name]?.trim();
  if (fromProcess) return fromProcess;

  const fromMeta = (import.meta.env as Record<string, unknown>)[name];
  if (typeof fromMeta === "string" && fromMeta.trim()) {
    return fromMeta.trim();
  }

  throw new Error(`Missing server env: ${name}`);
}
