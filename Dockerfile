# Etapa 1: Compilar Angular con SSR
FROM node:22-alpine AS build

WORKDIR /app

# Copiar archivos del proyecto
COPY package*.json ./
RUN npm install

COPY . .

# Compilar el proyecto Angular (SSR incluido)
RUN npm run build

# Etapa 2: Servir con Node.js usando el servidor SSR generado
FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/dist/front-end-web /app/dist/front-end-web
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

EXPOSE 8080

CMD ["node", "dist/front-end-web/server/server.mjs"]
