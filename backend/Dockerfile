FROM node:20-slim

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar el resto del código
COPY . .

# Exponer el puerto del backend
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["npm", "start"]