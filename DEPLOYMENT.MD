# 🚀 Guía de Deployment - Susana Shop

## 📋 Requisitos Previos

- Kubernetes cluster configurado
- kubectl instalado y configurado
- Git instalado

## 🏗️ Estructura del Proyecto
```
PAGINA_WEB_NODO/
├── deploy.sh                    # Script de deployment completo
├── update-database.sh           # Script para actualizar DB
├── DEPLOYMENT.md                # Esta guía
├── backend/                     # API Node.js/TypeScript
├── frontend/                    # Aplicación web
│   └── k8s/                     # Archivos de Kubernetes
│       ├── app/                 # Deployments de aplicación
│       ├── base/                # Configuraciones base
│       └── mysql/               # Configuración de MySQL
```

## 🚀 Deployment Completo

### Opción 1: Usando el script automático (recomendado)
```bash
./deploy.sh
```

### Opción 2: Manual
```bash
# 1. Namespace y configuraciones base
kubectl apply -f frontend/k8s/base/

# 2. MySQL
kubectl apply -f frontend/k8s/mysql/

# 3. Aplicación
kubectl apply -f frontend/k8s/app/
```

## 🔄 Actualizar Base de Datos
```bash
./update-database.sh
```

## 📊 Comandos Útiles

### Ver estado
```bash
kubectl get pods -n susana-shop
kubectl get all -n susana-shop
```

### Ver logs
```bash
kubectl logs -f deployment/backend -n susana-shop
kubectl logs -f deployment/frontend -n susana-shop
kubectl logs -f deployment/mysql -n susana-shop
```

### Acceder localmente
```bash
kubectl port-forward service/frontend 3000:3000 -n susana-shop
kubectl port-forward service/backend 4000:4000 -n susana-shop
```

## 👤 Usuarios de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| admin@tienda.com | admin123 | admin |
| juan@example.com | admin123 | cliente |
| maria@example.com | admin123 | cliente |
| carlos@example.com | admin123 | cliente |

## 🗑️ Eliminar Todo
```bash
kubectl delete namespace susana-shop
```

## 🔧 Troubleshooting

### Pod no inicia
```bash
kubectl describe pod <pod-name> -n susana-shop
kubectl logs <pod-name> -n susana-shop
```

### Reiniciar deployment
```bash
kubectl rollout restart deployment/backend -n susana-shop
kubectl rollout restart deployment/frontend -n susana-shop
```
```

## ✅ Resumen de archivos creados:
```
PAGINA_WEB_NODO/
├── deploy.sh                           ← Crear ✅
├── update-database.sh                  ← Crear ✅
├── DEPLOYMENT.md                       ← Crear ✅
├── .gitignore                          ← Ya existe
└── frontend/
    └── k8s/
        ├── base/
        │   ├── secret-app.yaml         ← Ya existe ✅
        │   └── secret-mysql.yaml       ← Ya existe ✅
        └── mysql/
            └── configmap-init-sql.yaml ← Ya existe ✅