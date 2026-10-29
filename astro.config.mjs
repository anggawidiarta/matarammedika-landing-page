// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig, envField, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  // Astro's built-in check compares Origin with a URL it cannot build correctly behind a TLS proxy,
  // so it rejects every form POST. /kelola writes are guarded by guardJsonWrite/guardSameOrigin instead.
  security: {
    checkOrigin: false,
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: blob: https://*.supabase.co",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      // The React islands render a few inline style attributes (progress bar, icon sizes, WhatsApp mask); script and <style> stay hash-only.
      styleDirective: {
        resources: ["'self'", { resource: "'unsafe-inline'", kind: "attribute" }],
      },
    },
  },
  adapter: node({ mode: "standalone" }),
  integrations: [react()],
  env: {
    schema: {
      SUPABASE_URL: envField.string({ context: "server", access: "secret" }),
      SUPABASE_SERVICE_ROLE_KEY: envField.string({ context: "server", access: "secret" }),
      SURVEY_IP_HASH_PEPPER: envField.string({ context: "server", access: "secret" }),
      TRUST_PROXY: envField.string({ context: "server", access: "secret", optional: true }),
      SSO_USERS_URL: envField.string({ context: "server", access: "secret", optional: true }),
      SITE_ORIGIN: envField.string({ context: "server", access: "secret", optional: true }),
      IG_USER_ID: envField.string({ context: "server", access: "secret", optional: true }),
      IG_ACCESS_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
      IG_GRAPH_VERSION: envField.string({ context: "server", access: "secret", optional: true }),
      IG_GRAPH_HOST: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Poppins",
      cssVariable: "--font-poppins",
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Sora",
      cssVariable: "--font-sora",
      weights: [400, 600],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "lucide-react",
        "zod",
      ],
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
