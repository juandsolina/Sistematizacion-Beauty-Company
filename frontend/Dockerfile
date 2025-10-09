# ---------- BUILD ----------
FROM node:20-slim AS build
WORKDIR /app 
ENV NODE_PATH=/app/node_modules


# Asegura devDependencies en build
ENV NODE_ENV=development

# Usa el lockfile si existe
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Código fuente
COPY . .

# Variables Vite (se leen con import.meta.env.VITE_API_URL)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build
RUN npm run build --verbose

# ---------- RUNTIME ----------
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
