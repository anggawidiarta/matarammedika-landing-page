// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig, envField, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [react()],
  env: {
    schema: {
      SUPABASE_URL: envField.string({ context: "server", access: "secret" }),
      SUPABASE_SERVICE_ROLE_KEY: envField.string({ context: "server", access: "secret" }),
      SURVEY_IP_HASH_PEPPER: envField.string({ context: "server", access: "secret" }),
      TRUST_PROXY: envField.string({ context: "server", access: "secret", optional: true }),
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
