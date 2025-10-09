# 🛍️ Sistema de Tienda - Beauty Company

Sistema completo de e-commerce para gestión de tienda de productos de belleza, desarrollado con Node.js, TypeScript, React y MySQL.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Variables de Entorno](#variables-de-entorno)
- [Docker](#docker)
- [Kubernetes](#kubernetes)
- [Contribuir](#contribuir)

## ✨ Características

### Backend
- 🔐 Autenticación JWT con bcrypt
- 👤 Sistema de usuarios y roles (admin/cliente)
- 🛒 Gestión completa de productos
- 📦 Carrito de compras
- 🔄 API RESTful
- 🗄️ Base de datos MySQL
- 📝 Validación de datos
- 🔒 Middleware de autenticación

### Frontend
- ⚛️ React + TypeScript
- 🎨 Interfaz moderna y responsiva
- 🔥 Hot Reload con Vite
- 🛒 Carrito de compras interactivo
- 📱 Mobile-first design
- 🔐 Gestión de sesiones
- 📊 Panel de administración (CRUD)

### DevOps
- 🐳 Docker Compose para desarrollo
- ☸️ Configuración Kubernetes lista para producción
- 🔧 phpMyAdmin para gestión de base de datos
- 📦 Imágenes optimizadas

## 🚀 Tecnologías

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **Base de datos:** MySQL 8
- **Autenticación:** JWT + bcrypt
- **ORM:** mysql2

### Frontend
- **Framework:** React 18
- **Build tool:** Vite
- **Lenguaje:** TypeScript
- **Routing:** React Router
- **Estado:** Context API
- **Estilos:** CSS modules

### DevOps
- **Containerización:** Docker
- **Orquestación:** Docker Compose / Kubernetes
- **Gestión BD:** phpMyAdmin
- **CI/CD Ready**

## 📦 Requisitos Previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado
- [Node.js](https://nodejs.org/) 20+ (solo para desarrollo local del frontend)
- [Git](https://git-scm.com/)
- 8GB RAM mínimo
- 5GB espacio en disco

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/juandsolina/Sistematizacion-Beauty-Company.git
cd Sistematizacion-Beauty-Company
```

### 2. Configurar variables de entorno

#### Backend

```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env` con tus configuraciones:

```env
DB_HOST=db
DB_USER=user
DB_PASSWORD=pass123
DB_NAME=tienda
DB_PORT=3306
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
```

#### Frontend

```bash
cp frontend/.env.example frontend/.env.local
```

```env
VITE_API_URL=http://localhost:3000
```

### 3. Iniciar servicios con Docker

```bash
# Levantar base de datos, backend y phpMyAdmin
docker compose up -d

# Ver logs
docker compose logs -f
```

### 4. Iniciar frontend en desarrollo (hot reload)

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🎮 Uso

### Acceso a los servicios

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| 🎨 **Frontend** | http://localhost:5173 | - |
| 🟢 **Backend API** | http://localhost:3000 | - |
| 🔧 **phpMyAdmin** | http://localhost:8081 | root / root123 |
| 🗄️ **MySQL** | localhost:3306 | user / pass123 |

### Usuario por defecto

```
Email: admin@tienda.com
Password: admin123
```

### Comandos útiles

```bash
# Ver estado de contenedores
docker compose ps

# Ver logs del backend
docker compose logs -f backend

# Ver logs de MySQL
docker compose logs -f db

# Reiniciar backend
docker compose restart backend

# Detener todo
docker compose down

# Limpiar volúmenes (⚠️ borra la base de datos)
docker compose down -v

# Reconstruir contenedores
docker compose up --build -d
```

## 📁 Estructura del Proyecto

```
Sistematizacion-Beauty-Company/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuraciones
│   │   ├── controllers/      # Controladores de rutas
│   │   ├── middleware/       # Middleware personalizado
│   │   ├── routes/           # Definición de rutas
│   │   ├── services/         # Lógica de negocio
│   │   └── utils/            # Utilidades
│   ├── uploads/              # Imágenes de productos
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/           # Recursos estáticos
│   │   ├── components/       # Componentes reutilizables
│   │   ├── context/          # Context API
│   │   ├── pages/            # Páginas de la aplicación
│   │   ├── services/         # Servicios API
│   │   └── styles/           # Estilos CSS
│   ├── public/               # Archivos públicos
│   ├── Dockerfile
│   ├── nginx.conf            # Configuración Nginx
│   └── vite.config.ts
│
├── k8s/                      # Manifiestos Kubernetes
│   ├── app/                  # Deployments de aplicaciones
│   ├── base/                 # Recursos base
│   ├── ingress/              # Configuración Ingress
│   └── mysql/                # Deployment MySQL
│
├── docker-compose.yml        # Orquestación Docker
├── init.sql                  # Script inicial de base de datos
└── README.md
```

## 🔌 API Endpoints

### Autenticación

```http
POST   /api/auth/register     # Registrar nuevo usuario
POST   /api/auth/login        # Iniciar sesión
GET    /api/auth/profile      # Obtener perfil (requiere token)
```

### Productos

```http
GET    /api/productos         # Listar todos los productos
GET    /api/productos/:id     # Obtener producto por ID
POST   /api/productos         # Crear producto (admin)
PUT    /api/productos/:id     # Actualizar producto (admin)
DELETE /api/productos/:id     # Eliminar producto (admin)
```

### Usuarios (Admin)

```http
GET    /api/usuarios          # Listar usuarios (admin)
GET    /api/usuarios/:id      # Obtener usuario (admin)
PUT    /api/usuarios/:id      # Actualizar usuario (admin)
DELETE /api/usuarios/:id      # Eliminar usuario (admin)
```

### Ejemplo de uso con curl

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tienda.com","password":"admin123"}'

# Obtener productos
curl http://localhost:3000/api/productos

# Crear producto (requiere token)
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"nombre":"Producto Nuevo","precio":29.99,"descripcion":"Descripción"}'
```

## 🔐 Variables de Entorno

### Backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_HOST` | Host de MySQL | `db` |
| `DB_USER` | Usuario de MySQL | `user` |
| `DB_PASSWORD` | Contraseña de MySQL | `pass123` |
| `DB_NAME` | Nombre de la base de datos | `tienda` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `JWT_SECRET` | Secreto para JWT | `supersecreto` |
| `JWT_EXPIRES_IN` | Expiración del token | `7d` |
| `NODE_ENV` | Entorno de Node | `production` |
| `PORT` | Puerto del servidor | `3000` |

### Frontend (`frontend/.env.local`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL del backend | `http://localhost:3000` |

## 🐳 Docker

### Desarrollo (configuración actual)

```bash
# Backend y base de datos en Docker
docker compose up -d

# Frontend en local con hot reload
cd frontend && npm run dev
```

### Producción (todo en Docker)

Para desplegar todo en Docker:

1. Descomenta el servicio `frontend` en `docker-compose.yml`
2. Ejecuta:

```bash
docker compose up --build -d
```

### Comandos Docker útiles

```bash
# Ver imágenes
docker images

# Limpiar imágenes no usadas
docker image prune -a

# Inspeccionar contenedor
docker inspect node-app

# Ejecutar comando en contenedor
docker compose exec backend npm run build

# Ver uso de recursos
docker stats
```

## ☸️ Kubernetes

El proyecto incluye manifiestos de Kubernetes para despliegue en producción.

### Estructura de manifiestos

```
k8s/
├── app/
│   ├── deployment-backend.yaml
│   ├── deployment-frontend.yaml
│   ├── service-backend.yaml
│   └── service-frontend.yaml
├── mysql/
│   ├── deployment-mysql.yaml
│   ├── service-mysql.yaml
│   └── configmap-init-sql.yaml
├── base/
│   ├── namespace.yaml
│   ├── secret-app.yaml
│   └── pvc-mysql.yaml
└── ingress/
    └── ingress.yaml
```

### Desplegar en Kubernetes

```bash
# Crear namespace
kubectl apply -f k8s/base/namespace.yaml

# Aplicar secrets
kubectl apply -f k8s/base/secret-app.yaml
kubectl apply -f k8s/base/secret-mysql.yaml

# Desplegar MySQL
kubectl apply -f k8s/mysql/

# Desplegar aplicaciones
kubectl apply -f k8s/app/

# Configurar ingress
kubectl apply -f k8s/ingress/

# Verificar pods
kubectl get pods -n tienda

# Ver logs
kubectl logs -f deployment/backend -n tienda
```

## 🛠️ Desarrollo

### Comandos de desarrollo

```bash
# Backend
cd backend
npm install
npm run dev        # Desarrollo con hot reload
npm run build      # Compilar TypeScript
npm start          # Iniciar en producción
npm test           # Ejecutar tests

# Frontend
cd frontend
npm install
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # Linter
```

### Agregar nuevos paquetes

```bash
# Backend
cd backend
npm install nombre-del-paquete

# Frontend
cd frontend
npm install nombre-del-paquete
```

### Resetear contraseña de admin

```bash
docker compose exec backend node reset-admin-password.js
```

## 🐛 Solución de Problemas

### El backend no conecta a MySQL

```bash
# Verificar que MySQL esté healthy
docker compose ps

# Ver logs de MySQL
docker compose logs db

# Reiniciar MySQL
docker compose restart db
```

### Puerto ocupado

Si el puerto 3000, 3306 u 8080 está ocupado:

```bash
# Cambiar puertos en docker-compose.yml
ports:
  - "3001:3000"  # Cambiar puerto host
```

### Error de permisos en Windows

Ejecuta PowerShell como Administrador o deshabilita WSL2 en Docker Desktop.

### Problemas con volúmenes

```bash
# Eliminar volúmenes y empezar de cero
docker compose down -v
docker compose up -d
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convención de commits

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Formato, punto y coma, etc
- `refactor:` Refactorización de código
- `test:` Agregar tests
- `chore:` Mantenimiento

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Juan D. Solina** - [@juandsolina](https://github.com/juandsolina)

---

## 📞 Soporte

Si tienes alguna pregunta o problema:

- 🐛 Abre un [Issue](https://github.com/juandsolina/Sistematizacion-Beauty-Company/issues)
- 💬 Inicia una [Discusión](https://github.com/juandsolina/Sistematizacion-Beauty-Company/discussions)
- 📧 Contacto: [tu-email@ejemplo.com]

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub

**Desarrollado con ❤️ para SusanaTiendasBogotá**
