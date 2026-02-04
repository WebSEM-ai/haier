FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy root workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/cms/package.json ./apps/cms/
COPY packages/payload-types/package.json ./packages/payload-types/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/payload-types ./packages/payload-types
COPY apps/cms ./apps/cms

# Build
WORKDIR /app/apps/cms
RUN pnpm build

# Production
FROM node:20-alpine AS runner
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/cms ./apps/cms
COPY --from=base /app/packages ./packages

WORKDIR /app/apps/cms

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["pnpm", "start"]
