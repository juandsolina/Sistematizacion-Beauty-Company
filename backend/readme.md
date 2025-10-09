# Proyecto Tienda - Full Stack

Sistema de tienda online con Node.js, TypeScript, MySQL y Vite.

## 🚀 Tecnologías

### Backend
- Node.js + TypeScript
- Express
- MySQL
- JWT Authentication
- bcrypt

### Frontend
- Vite
- TypeScript
- React (o tu framework)

### DevOps
- Docker + Docker Compose
- phpMyAdmin

## 📋 Requisitos Previos

- Docker Desktop
- Node.js 20+ (para desarrollo local del frontend)
- Git

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
cd TU_REPOSITORIO
```

### 2. Configurar variables de entorno

#### Backend
```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env` con tus credenciales.

#### Frontend
```bash
cp frontend/.env.example frontend/.env.local
```

### 3. Iniciar servicios Docker

```bash
# Levantar base de datos, backend y phpMyAdmin
docker compose up -d

# Ver logs
docker compose logs -f
```

### 4. Iniciar frontend en desarrollo

```bash
cd frontend
npm install
npm run dev
```

## 🌐 URLs de Acceso

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Frontend | http://localhost:5173 | - |
| Backend API | http://localhost:3000 | - |
| phpMyAdmin | http://localhost:8081 | root / root123 |
| MySQL | localhost:3306 | user / pass123 |

## 👤 Usuario por Defecto

- **Email**: admin@tienda.com
- **Password**: admin123

## 📁 Estructura del Proyecto

```
.
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── init.sql
└── README.md
```

## 🛠️ Comandos Útiles

### Docker

```bash
# Ver contenedores activos
docker compose ps

# Ver logs del backend
docker compose logs -f backend

# Reiniciar backend
docker compose restart backend

# Detener todo
docker compose down

# Limpiar volúmenes (⚠️ borra la BD)
docker compose down -v
```

### Frontend

```bash
cd frontend
npm run dev          # Desarrollo con hot reload
npm run build        # Compilar para producción
npm run preview      # Preview de producción
```

## 🔒 Seguridad

- Las contraseñas se hashean con bcrypt
- Autenticación con JWT
- Variables de entorno para credenciales
- CORS configurado

## 📝 Scripts Disponibles

### Backend
- `npm run dev` - Desarrollo con hot reload
- `npm run build` - Compilar TypeScript
- `npm start` - Iniciar en producción

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build

## 🐛 Solución de Problemas

### Error de autenticación
```bash
# Resetear contraseña del admin
docker compose exec backend node reset-admin-password.js
```

### El backend no conecta a la BD
```bash
# Verificar que la BD esté healthy
docker compose ps

# Ver logs de MySQL
docker compose logs db
```

### Puerto ocupado
```bash
# Cambiar puertos en docker-compose.yml
ports:
  - "NUEVO_PUERTO:3000"
```

## 📦 Despliegue en Producción

Para desplegar el frontend también en Docker:

1. Descomentar el servicio `frontend` en `docker-compose.yml`
2. Ejecutar:
```bash
docker compose up --build -d
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## ✨ Autor

Tu Nombre - [@tu_usuario](https://github.com/tu_usuario)