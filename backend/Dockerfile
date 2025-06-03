FROM oven/bun:1.2-alpine AS base

WORKDIR /app

# === AUTHJS ===
ARG SECRET_ACCESS
ENV SECRET_ACCESS=$SECRET_ACCESS

ENV NODE_ENV=production


COPY . .

RUN bun install --frozen-lockfile
RUN bunx prisma generate

EXPOSE 8080

CMD ["bun", "run", "index.ts"]