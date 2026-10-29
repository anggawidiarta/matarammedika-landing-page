# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4321

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

USER node

EXPOSE 4321

# Secrets (SUPABASE_*, SURVEY_IP_HASH_PEPPER, TRUST_PROXY) are read at runtime via astro:env, so supply them as container env in Dokploy rather than build args.
# TRUST_PROXY is the number of trusted proxies in front of the container (1 for Traefik alone, 2 behind a CDN); see .env.example.
CMD ["node", "./dist/server/entry.mjs"]
