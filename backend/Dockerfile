FROM node:20-slim

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar TODAS las dependencias (incluidas devDependencies para compilar)
RUN npm ci

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer el puerto del backend
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["npm", "start"]