FROM node:22-slim AS build
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
ENV DATABASE_URL="postgresql://u:p@localhost:5432/db"
COPY package*.json ./
RUN npm install --ignore-scripts
COPY . .
RUN npx prisma generate --config prisma7.config.ts && npm run build
RUN npm prune --omit=dev

FROM node:22-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
CMD ["node", "dist/server.js"]
