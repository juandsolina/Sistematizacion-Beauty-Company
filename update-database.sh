#!/bin/bash

set -e

echo "🔄 Actualizando base de datos de Susana Shop..."

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

# Aplicar ConfigMap actualizado
echo "📋 Actualizando ConfigMap de inicialización..."
kubectl apply -f $K8S_PATH/mysql/configmap-init-sql.yaml -n $NAMESPACE
print_message "ConfigMap actualizado"

# Obtener el nombre del pod de MySQL
MYSQL_POD=$(kubectl get pod -n $NAMESPACE -l app=mysql -o jsonpath='{.items[0].metadata.name}')

if [ -z "$MYSQL_POD" ]; then
    print_error "No se encontró el pod de MySQL"
    exit 1
fi

print_message "Pod de MySQL encontrado: $MYSQL_POD"

# Opciones de actualización
echo ""
echo "⚠️  Selecciona cómo actualizar la base de datos:"
echo ""
echo "1) Reiniciar pod de MySQL"
echo "   - Borra TODOS los datos existentes"
echo "   - Ejecuta init.sql desde cero"
echo "   - Recrea tablas y datos de ejemplo"
echo ""
echo "2) Cancelar"
echo ""
read -p "Opción [1-2]: " option

case $option in
    1)
        print_warning "⚠️  ADVERTENCIA: Esto borrará TODOS los datos existentes en la base de datos"
        echo ""
        read -p "Escribe 'SI BORRAR TODO' para confirmar: " confirm
        if [ "$confirm" = "SI BORRAR TODO" ]; then
            echo ""
            echo "🔄 Reiniciando pod de MySQL..."
            kubectl delete pod $MYSQL_POD -n $NAMESPACE
            
            echo "⏳ Esperando a que MySQL vuelva a estar listo..."
            kubectl wait --for=condition=ready pod -l app=mysql -n $NAMESPACE --timeout=300s
            
            print_message "✅ Base de datos reinicializada correctamente"
            echo ""
            echo "📦 Los datos incluyen:"
            echo "  ✓ 4 usuarios (1 admin, 3 clientes)"
            echo "  ✓ 15 productos (9 activos, 6 desactivados)"
            echo "  ✓ Datos de ejemplo en carrito y pedidos"
            echo ""
            echo "👤 Credenciales de acceso:"
            echo "  Admin:   admin@tienda.com / admin123"
            echo "  Cliente: juan@example.com / admin123"
            echo "  Cliente: maria@example.com / admin123"
            echo "  Cliente: carlos@example.com / admin123"
        else
            echo ""
            echo "❌ Cancelado - No se realizaron cambios"
            exit 0
        fi
        ;;
    2)
        echo ""
        echo "❌ Cancelado"
        exit 0
        ;;
    *)
        print_error "Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "🎉 ${GREEN}Actualización completada!${NC}"