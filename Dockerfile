# Stage 1: Build the app
FROM node:22.14.0-alpine AS builder

WORKDIR /app

# 1) Copia package.json y package-lock.json e instala dependencias
COPY package.json package-lock.json ./
RUN npm ci

# 2) Copia el resto del código y lanza el build (produce /app/dist/front-end-web/{browser,server})
COPY . .
RUN npm run build

# Stage 2: Prepare the runtime image
FROM node:22.14.0-alpine AS runner

WORKDIR /app

# 3) Copia solo los artefactos de producción y el package.json
COPY --from=builder /app/dist/front-end-web /app/dist/front-end-web
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/package-lock.json /app/

# 4) Instala únicamente las dependencias de producción
RUN npm ci --omit=dev

# 5) Variables de entorno y puerto
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

# 6) Comando por defecto: arranca el servidor SSR
CMD ["node", "dist/front-end-web/server/server.mjs"]
