# --- Etapa 1: "Builder" ---
# Usamos una imagen completa para tener herramientas de compilación
FROM node:20 AS builder
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies)
RUN npm ci

# Copiar todo el código fuente (.ts, tsconfig.json, etc.)
COPY . .

# ¡El paso clave! Compilar TS a JS, creando la carpeta 'dist'
RUN npm run build

# --- Etapa 2: "Producción" ---
# Empezamos desde una imagen limpia y ligera
FROM node:20-slim
WORKDIR /app

# Copiar solo los archivos de definición de paquetes
COPY package*.json ./

# Instalar SOLO las dependencias de producción
RUN npm ci --only=production

# Copiar la carpeta 'dist' (ya compilada) desde la etapa 'builder'
COPY --from=builder /app/dist ./dist

# Exponer el puerto
EXPOSE 3000

# El comando de inicio ahora funcionará porque /app/dist/server.js existe
CMD ["npm", "start"]