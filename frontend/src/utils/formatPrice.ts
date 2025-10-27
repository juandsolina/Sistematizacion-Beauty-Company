// frontend/src/utils/formatPrice.ts

export const formatPrice = (price: number | string): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    console.error('❌ Precio inválido:', price);
    return 'COP $0';
  }

  // Multiplica por 10 para ajustar la escala
  const adjustedPrice = numericPrice * 10;

  // Formatea con separador de miles
  const formatted = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(adjustedPrice);

  return `COP $${formatted}`;
};

// Ejemplos de conversión:
// Base de datos → Mostrado
// 350   → "COP $3.500"
// 1000  → "COP $10.000"  
// 5000  → "COP $50.000"
// 15000 → "COP $150.000"