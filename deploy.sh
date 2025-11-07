#!/bin/bash

set -e

echo "🚀 Iniciando deployment de Susana Shop..."

NAMESPACE="susana-shop"
K8S_PATH="frontend/k8s"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_message() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Verificar kubectl
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl no está instalado"
    exit 1
fi

print_message "kubectl OK"

# Verificar conexión al cluster
if ! kubectl cluster-info &> /dev/null; then
    print_error "No se puede conectar al cluster de Kubernetes"
    exit 1
fi

print_message "Conexión al cluster OK"

# Aplicar namespace
echo ""
echo "📦 Creando namespace..."
kubectl apply -f $K8S_PATH/base/namespace.yaml
print_message "Namespace aplicado"

# Aplicar secrets
echo ""
echo "🔐 Aplicando secrets..."
kubectl apply -f $K8S_PATH/base/secret-app.yaml
kubectl apply -f $K8S_PATH/base/secret-mysql.yaml
print_message "Secrets aplicados"

# Aplicar ConfigMaps
echo ""
echo "📋 Aplicando ConfigMaps..."
kubectl apply -f $K8S_PATH/base/configmap-app.yaml
kubectl apply -f $K8S_PATH/mysql/configmap-init-sql.yaml
print_message "ConfigMaps aplicados"

# Aplicar PVC
echo ""
echo "💾 Aplicando PersistentVolumeClaim..."
kubectl apply -f $K8S_PATH/base/pvc-mysql.yaml
print_message "PVC aplicado"

# Desplegar MySQL
echo ""
echo "🗄️  Desplegando MySQL..."
kubectl apply -f $K8S_PATH/mysql/deployment-mysql.yaml
kubectl apply -f $K8S_PATH/mysql/service-mysql.yaml

echo "⏳ Esperando a que MySQL esté listo (esto puede tomar 1-2 minutos)..."
kubectl wait --for=condition=ready pod -l app=mysql -n $NAMESPACE --timeout=300s

print_message "MySQL desplegado y listo"

# Desplegar Backend
echo ""
echo "⚙️  Desplegando Backend..."
kubectl apply -f $K8S_PATH/app/deployment-backend.yaml
kubectl apply -f $K8S_PATH/app/service-backend.yaml

echo "⏳ Esperando a que Backend esté listo..."
kubectl wait --for=condition=ready pod -l app=backend -n $NAMESPACE --timeout=300s

print_message "Backend desplegado y listo"

# Desplegar Frontend
echo ""
echo "🎨 Desplegando Frontend..."
kubectl apply -f $K8S_PATH/app/deployment-frontend.yaml
kubectl apply -f $K8S_PATH/app/service-frontend.yaml

echo "⏳ Esperando a que Frontend esté listo..."
kubectl wait --for=condition=ready pod -l app=frontend -n $NAMESPACE --timeout=300s

print_message "Frontend desplegado y listo"

# Mostrar status
echo ""
echo "📊 Estado de los pods:"
kubectl get pods -n $NAMESPACE

echo ""
echo "🌐 Servicios:"
kubectl get services -n $NAMESPACE

echo ""
echo "🎉 ${GREEN}Deployment completado exitosamente!${NC}"
echo ""
echo "📝 Comandos útiles:"
echo "  Ver logs del backend:    kubectl logs -f deployment/backend -n $NAMESPACE"
echo "  Ver logs del frontend:   kubectl logs -f deployment/frontend -n $NAMESPACE"
echo "  Ver logs de MySQL:       kubectl logs -f deployment/mysql -n $NAMESPACE"
echo ""
echo "🌐 Para acceder a la aplicación:"
echo "  Frontend: kubectl port-forward service/frontend 3000:3000 -n $NAMESPACE"
echo "  Backend:  kubectl port-forward service/backend 4000:4000 -n $NAMESPACE"
echo ""
echo "👤 Usuarios de prueba:"
echo "  Admin:    admin@tienda.com / admin123"
echo "  Cliente:  juan@example.com / admin123"